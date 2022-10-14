"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class TransactionItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            TransactionItem.belongsTo(models.Transaction)
            // TransactionItem.belongsTo(models.Book)
            TransactionItem.belongsTo(models.Cart)
        }
    }
    TransactionItem.init(
        {
            quantity: {
                type: DataTypes.INTEGER,
                // allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "TransactionItem",
        }
    )
    return TransactionItem
}
