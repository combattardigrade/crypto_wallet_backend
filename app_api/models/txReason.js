module.exports = (sequelize, DataTypes) => {
    return sequelize.define('txReason', {
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}