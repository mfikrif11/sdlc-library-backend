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
            total_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            borrow_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            return_date: {
                type: DataTypes.DATE,
                // allowNull: false,
            },
            is_penalty: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            total_penalty: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            loan_status: {
                defaultValue: "Waiting for return",
                type: DataTypes.STRING,
                allowNull: false,

            }
        },
        {
            sequelize,
            modelName: "Transaction",
        }
    )
    return Transaction
}