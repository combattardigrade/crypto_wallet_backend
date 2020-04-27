const User = require('../models/sequelize').User
const Contact = require('../models/sequelize').Contact
const sendJSONresponse = require('../utils/index.js').sendJSONresponse
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')

module.exports.createContact = (req, res) => {
    const userId = req.user.id
    const contactId = req.body.contactId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
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

        const contactAccount = await User.findOne({ where: { id: contactId }, transaction: t })

        if (!contactAccount) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        const [contact, created] = await Contact.findOrCreate({
            where: {
                userId,
                contactId,
            },
            defaults: {
                userId,
                contactId
            },
            transaction: t
        })

        if (!created) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact has already been added' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: contact })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.getContact = (req, res) => {
    const userId = req.user.id
    const contactId = req.params.contactId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!contactId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter a valid contact ID' })
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

        const contact = await User.findOne({
            where: { id: contactId },
            attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'createdAt'],
            transaction: t
        })

        if (!contact) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        const isContact = await Contact.findOne({
            where: {
                userId,
                contactId
            },
            transaction: t
        })

        if (!isContact) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The user is not added as contact' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: contact })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.getContacts = (req, res) => {
    const userId = req.user.id

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
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

        const contacts = await Contact.findAll({
            where: { userId },
            raw: true,
            transaction: t,
        })

        let contactsArray = []
        for (let contact of contacts) {
            let contactData = User.findOne({
                where: { id: contact.contactId },
                attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'createdAt'],
                raw: true,
                transaction: t
            })
            contactsArray.push(contactData)
        }

        const contactsData = await Promise.all(contactsArray)

        let payload = []
        let i = 0
        for (let contact of contacts) {
            payload.push({
                ...contact,
                ...contactsData[i],
            })
            i++
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: payload })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.searchContact = (req, res) => {
    const userId = req.user.id
    const searchValue = req.body.searchValue

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
        return
    }

    if (!searchValue) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter a valid search value' })
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

        const results = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: `%${searchValue}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${searchValue}%`
                        }
                    },
                    {
                        firstName: {
                            [Op.like]: `%${searchValue}%`
                        }
                    }
                ],
                [Op.not]: [
                    {
                        id: userId,
                    }
                ]
            },
            raw: true,
            transaction: t
        })

        const contacts = await Contact.findAll({
            where: {
                userId
            },
            transaction: t
        })

        const payload = []
        for(let result of results) {
            let flag = 0
            for(let contact of contacts) {
                if(result.id === contact.contactId) {
                    flag = 1
                    break;
                }
            }
            if(flag !== 1) {
                payload.push(result)
            }
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: payload })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.deleteContact = (req, res) => {
    const userId = req.user.id
    const contactId = req.params.contactId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
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

        const contactAccount = await User.findOne({ where: { id: contactId }, transaction: t })

        if (!contactAccount) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        await Contact.destroy({
            where: {
                userId,
                contactId,
            },            
            transaction: t
        })        

        sendJSONresponse(res, 200, { status: 'OK', message: 'Contact deleted correctly' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}

module.exports.adminAddContact = (req, res) => {
    const userId = req.body.userId
    const contactId = req.body.contactId

    if (!userId || !contactId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
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

        const contactAccount = await User.findOne({ where: { id: contactId }, transaction: t })

        if (!contactAccount) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        const [contact, created] = await Contact.findOrCreate({
            where: {
                userId,
                contactId,
            },
            defaults: {
                userId,
                contactId
            },
            transaction: t
        })

        if (!created) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact has already been added' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: contact })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}

module.exports.adminDeleteContact = (req, res) => {
    const userId = req.body.userId
    const contactId = req.body.contactId

    if (!userId || !contactId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Invalid session token' })
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

        const contactAccount = await User.findOne({ where: { id: contactId }, transaction: t })

        if (!contactAccount) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        await Contact.destroy({
            where: {
                userId,
                contactId,
            },            
            transaction: t
        })        

        sendJSONresponse(res, 200, { status: 'OK', message: 'Contact deleted correctly' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.adminGetContact = (req, res) => {
    const userId = req.params.userId
    const contactId = req.params.contactId    

    if (!userId || !contactId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Enter a valid contact ID' })
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

        const contact = await User.findOne({
            where: { id: contactId },
            attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'createdAt'],
            transaction: t
        })

        if (!contact) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The contact\'s account does not exist' })
            return
        }

        const isContact = await Contact.findOne({
            where: {
                userId,
                contactId
            },
            transaction: t
        })

        if (!isContact) {
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'The user is not added as contact' })
            return
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: contact })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}


module.exports.adminGetContacts = (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Missing required parameters' })
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

        const contacts = await Contact.findAll({
            where: { userId },
            raw: true,
            transaction: t,
        })

        let contactsArray = []
        for (let contact of contacts) {
            let contactData = User.findOne({
                where: { id: contact.contactId },
                attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'createdAt'],
                raw: true,
                transaction: t
            })
            contactsArray.push(contactData)
        }

        const contactsData = await Promise.all(contactsArray)

        let payload = []
        let i = 0
        for (let contact of contacts) {
            payload.push({
                ...contact,
                ...contactsData[i],
            })
            i++
        }

        sendJSONresponse(res, 200, { status: 'OK', payload: payload })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { status: 'ERROR', message: 'An error occurred. Please try again' })
            return
        })
}