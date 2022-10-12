"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Transaction.belongsTo(models.User)
            Transaction.hasMany(models.TransactionItem)
        }
    }
    Transaction.init(
        {
            total_penalty: {
                type: DataTypes.INTEGER,
            },
            borrow_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            return_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            total_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_penalty: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
        },
        {
            sequelize,
            modelName: "Transaction",
        }
    )
    return Transaction
}
