module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userAddress', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        privateKey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}