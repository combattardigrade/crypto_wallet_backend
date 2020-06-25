const Sequelize = require('sequelize')
const UserModel = require('./user')
const BalanceModel = require('./balance')
const TransactionModel = require('./transaction')
const TxReasonModel = require('./txReason')
const ContactModel = require('./contact')
const PaymentRequestModel = require('./paymentRequest')
const UserAddressModel = require('./userAddress')
const AdminModel = require('./admin')
const RegistrationKeyModel = require('./registrationKey')


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

const User = UserModel(sequelize, Sequelize)
const Balance = BalanceModel(sequelize, Sequelize)
const Transaction = TransactionModel(sequelize, Sequelize)
const TxReason = TxReasonModel(sequelize, Sequelize)
const Contact = ContactModel(sequelize, Sequelize)
const PaymentRequest = PaymentRequestModel(sequelize, Sequelize)
const UserAddress = UserAddressModel(sequelize, Sequelize)
const Admin = AdminModel(sequelize, Sequelize)
const RegistrationKey = RegistrationKeyModel(sequelize, Sequelize)

User.hasMany(Balance)
Transaction.belongsTo(User)
Contact.belongsTo(User)
PaymentRequest.belongsTo(User)
PaymentRequest.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'requestToUserId'
})
User.hasOne(UserAddress)
RegistrationKey.belongsTo(User)
User.hasOne(RegistrationKey)


sequelize.sync({force: false})
.then(() => {
    console.log('Database & tables created')
})

module.exports = {
    User,
    Balance,
    Transaction,
    TxReason,
    Contact,
    PaymentRequest,
    UserAddress,
    Admin,
    RegistrationKey,
    sequelize
}