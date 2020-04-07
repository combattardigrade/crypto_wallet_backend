module.exports = (sequelize,DataTypes) => {
	return sequelize.define('contact',{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		contactId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        
	})
}