const User = require('../models/sequelize').User
const Balance = require('../models/sequelize').Balance
const Transaction = require('../models/sequelize').Transaction
const UserAddress = require('../models/sequelize').UserAddress
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction

module.exports.sendTokens = (req, res) => {
    const userId = req.user.id
    const amount = req.body.amount
    const toAddress = req.body.toAddress

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!amount || !toAddress) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required fields' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        // Prepare Token Amount
        const tokenAmount = parseFloat(amount) * 10000

        // Get Contract ABI
        const CONTRACT_ABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/contractABI.json'), 'utf-8'))

        // Connect to HTTP Provider
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_HTTP_PROVIDER))
        // Instantiate Contract
        const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS, { from: process.env.ETH_PUB_KEY })

        // Determine the nonce
        const count = await web3.eth.getTransactionCount(process.env.ETH_PUB_KEY)
        console.log(`Num of transactions ${count}`)

        // Check Balance
        const bankBalance = await contract.methods.balanceOf(process.env.ETH_PUB_KEY).call()
        console.log(`Balance ${bankBalance}`)

        if (parseFloat(bankBalance) < parseFloat(amount)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'There are not enough JWS reserves to perform the action' })
            return
        }

        // Check if toAddress is a valid ETH Address
        if (!web3.utils.isAddress(toAddress)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter a valid Ethereum address' })
            return
        }

        // Get user's balance
        const userBalance = await Balance.findOne({
            where: {
                userId,
                currency: 'JWS'
            },
            transaction: t
        })

        // Check user's balance
        if (!userBalance || parseFloat(userBalance.amount) < parseFloat(amount)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Not enough balance' })
            return
        }

        // List of ChainIDs
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
        // Prepare Raw Transaction
        const rawTx = {
            from: process.env.ETH_PUB_KEY,
            nonce: '0x' + count.toString(16),
            gasPrice: '0x003B9ACA00',
            gasLimit: '0x250CA',
            to: process.env.CONTRACT_ADDRESS,
            value: '0x0',
            data: contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
            chainId: '0x0' + process.env.ETH_CHAIN_ID
        }

        // Create Tx
        const tx = new Tx(rawTx, { chain: process.env.ETH_CHAIN_NAME })

        // Sign Tx
        const privKey = new Buffer(process.env.ETH_PRIV_KEY, 'hex')
        tx.sign(privKey)
        const serializedTx = tx.serialize()

        // Broadcast Tx
        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async (err, txHash) => {
            if (err) {
                console.log(err)
                sendJSONresponse(res, 404, { status: 'ERROR', message: err })
                return
            }


            // save tx
            console.log(txHash)
            const savedTx = await Transaction.create({
                userId,
                amount,
                currency: 'JWS',
                operationType: 'WITHDRAWAL',
                txHash: txHash,
                fromAddress: process.env.ETH_PUB_KEY,
                toAddress,
                status: 'COMPLETED',
            }, { transaction: t })

            // update balance
            userBalance.amount = parseFloat(userBalance.amount) - parseFloat(amount)
            await userBalance.save({ transaction: t })

            sendJSONresponse(res, 200, { status: 'OK', payload: savedTx, message: 'The transaction has been processed correctly' })
            return
        })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}

module.exports.checkDeposits = (req, res) => {

    sequelize.transaction(async (t) => {
        // Get Contract ABI
        const CONTRACT_ABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/contractABI.json'), 'utf-8'))

        // Connect to HTTP Provider
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_HTTP_PROVIDER))

        // Instantiate Contract
        const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS, { from: process.env.ETH_PUB_KEY })

        // Get current blockNumber
        const currentBlockNumber = parseInt(await web3.eth.getBlockNumber())

        // Get Transfer events
        const events = await contract.getPastEvents('Transfer', { fromBlock: currentBlockNumber - 6000, toBlock: 'latest' })

        for (let e of events) {

            // Transaction not confirmed
            if (parseInt(e.blockNumber) > currentBlockNumber - 25) {
                continue
            }

            // Check if `to` address is in DB
            const userAddress = await UserAddress.findOne({
                where: {
                    address: e.returnValues.to,
                },
               
                transaction: t
            })
           
            // Address is not in db
            if (!userAddress) {
                continue
            }           
            
            const [tx, created] = await Transaction.findOrCreate({
                where: {
                    txHash: e.transactionHash,
                },
                defaults: {
                    userId: userAddress.userId,
                    amount: parseFloat(e.returnValues.value) / 10000,
                    currency: 'JWS',
                    operationType: 'DEPOSIT',
                    txHash: e.transactionHash,
                    fromAddress: e.returnValues.from,
                    toAddress: e.returnValues.to,
                    status: 'COMPLETED'
                },
                transaction: t
            })
            
            // Tx already saved
            if (!created) {
                continue
            }
            
            // update user's balance
            const userBalance = await Balance.findOne({
                where: {
                    userId: userAddress.userId,
                    currency: 'JWS'
                },
                transaction: t
            })

            userBalance.amount = parseFloat(userBalance.amount) + parseFloat(e.returnValues.value) / 10000
            await userBalance.save({ transaction: t })
            
        }

        sendJSONresponse(res, 200, { status: 'OK', message: 'Desposits updated...' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })


}


module.exports.adminSendTokens = (req, res) => {
    const userId = req.body.userId
    const amount = req.body.amount
    const toAddress = req.body.toAddress

    if (!userId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!amount || !toAddress) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Enter all the required fields' })
        return
    }

    sequelize.transaction(async (t) => {
        const user = await User.findOne({
            where: {
                id: userId,
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'User not found' })
            return
        }

        // Prepare Token Amount
        const tokenAmount = parseFloat(amount) * 10000

        // Get Contract ABI
        const CONTRACT_ABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/contractABI.json'), 'utf-8'))

        // Connect to HTTP Provider
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_HTTP_PROVIDER))
        // Instantiate Contract
        const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS, { from: process.env.ETH_PUB_KEY })

        // Determine the nonce
        const count = await web3.eth.getTransactionCount(process.env.ETH_PUB_KEY)
        console.log(`Num of transactions ${count}`)

        // Check Balance
        const bankBalance = await contract.methods.balanceOf(process.env.ETH_PUB_KEY).call()
        console.log(`Balance ${bankBalance}`)

        if (parseFloat(bankBalance) < parseFloat(amount)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'There are not enough JWS reserves to perform the action' })
            return
        }

        // Check if toAddress is a valid ETH Address
        if (!web3.utils.isAddress(toAddress)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter a valid Ethereum address' })
            return
        }

        // Get user's balance
        const userBalance = await Balance.findOne({
            where: {
                userId,
                currency: 'JWS'
            },
            transaction: t
        })

        // Check user's balance
        if (!userBalance || parseFloat(userBalance.amount) < parseFloat(amount)) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'Not enough balance' })
            return
        }

        // List of ChainIDs
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
        // Prepare Raw Transaction
        const rawTx = {
            from: process.env.ETH_PUB_KEY,
            nonce: '0x' + count.toString(16),
            gasPrice: '0x003B9ACA00',
            gasLimit: '0x250CA',
            to: process.env.CONTRACT_ADDRESS,
            value: '0x0',
            data: contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
            chainId: '0x0' + process.env.ETH_CHAIN_ID
        }

        // Create Tx
        const tx = new Tx(rawTx, { chain: process.env.ETH_CHAIN_NAME })

        // Sign Tx
        const privKey = new Buffer(process.env.ETH_PRIV_KEY, 'hex')
        tx.sign(privKey)
        const serializedTx = tx.serialize()

        // Broadcast Tx
        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async (err, txHash) => {
            if (err) {
                console.log(err)
                sendJSONresponse(res, 404, { status: 'ERROR', message: err })
                return
            }


            // save tx
            console.log(txHash)
            const savedTx = await Transaction.create({
                userId,
                amount,
                currency: 'JWS',
                operationType: 'WITHDRAWAL',
                txHash: txHash,
                fromAddress: process.env.ETH_PUB_KEY,
                toAddress,
                status: 'COMPLETED',
            }, { transaction: t })

            // update balance
            userBalance.amount = parseFloat(userBalance.amount) - parseFloat(amount)
            await userBalance.save({ transaction: t })

            sendJSONresponse(res, 200, { status: 'OK', payload: savedTx, message: 'The transaction has been processed correctly' })
            return
        })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred, please try again' })
            return
        })
}