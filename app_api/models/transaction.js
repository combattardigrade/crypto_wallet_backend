module.exports = (sequelize,DataTypes) => {
	return sequelize.define('transaction',{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
        toUserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		amount: {
            type: DataTypes.DECIMAL(16,8),
            allowNull: false,
            defaultValue: 0
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'JWS'
        },
        operationType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'transfer'
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        txHash:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        fromAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        toAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'PENDING'
        }
	})
}