"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Book)
            Cart.belongsTo(models.User)
        }
    }
    Cart.init(
        {},
        {
            sequelize,
            modelName: "Cart",
        }
    )
    return Cart
}
