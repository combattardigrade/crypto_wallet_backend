const Sequelize = require('sequelize')
const UserModel = require('./user')
const BalanceModel = require('./balance')
const TransactionModel = require('./transaction')
const TxReasonModel = require('./txReason')
const ContactModel = require('./contact')
const AdminModel = require('./admin')


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
const Admin = AdminModel(sequelize, Sequelize)

User.hasMany(Balance)
Transaction.belongsTo(User)
Contact.belongsTo(User)


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
    Admin,
    sequelize
}