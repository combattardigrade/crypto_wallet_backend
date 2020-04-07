const crypto = require('crypto')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        hash: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },      
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },        
        status: {
            type: DataTypes.STRING,
            allowNull: true, 
            defaultValue: 'ACTIVE'           
        }
    })

    User.prototype.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex')
        this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');
    }

    User.prototype.validPassword = function(password) {
        var hash = crypto.pbkdf2Sync(String(password),this.salt,1000,64,'sha512').toString('hex');
        return this.hash === hash
    }

    User.prototype.generateJwt = function() {
        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 30)        
        return jwt.sign({
            id: this.id,
            username: this.username,         
            email: this.email, 
			exp: parseInt(expiry.getTime() + 1000*60*60*24)
        }, process.env.JWT_SECRET)
    }

    return User
}