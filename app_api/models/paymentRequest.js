module.exports = (sequelize,DataTypes) => {
	return sequelize.define('paymentRequest',{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
        },
        requestToUserId: {
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
            defaultValue: 'INTERNAL_TRANSFER'
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },        
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'PENDING'
        }
	})
}