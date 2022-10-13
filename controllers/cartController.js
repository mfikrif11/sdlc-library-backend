const db = require("../models")
const Cart = db.Cart

const cartController = {
    addToCart: async (req, res) => {

        const { BookId } = req.body

        const findBookInCart = await Cart.findOne({
            where: {
                BookId: BookId
            }
        })

        if (findBookInCart) {
            return res.status(400).json({
                message: "You already add this book to your cart",
            })
        }
        const addBookToCart = await Cart.create({
            UserId: req.user.id,
            BookId: BookId
        })

        return res.status(201).json({
            message: "Post created",
            data: addBookToCart
        })
    },
    showCartItems: async (req, res) => {
        try {
            const seeAllCartItems = await Cart.findAll({
                include: [{ model: db.Book }],
            })

            return res.status(200).json({
                message: "Get all expenses",
                data: seeAllCartItems
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    deleteBookFromCart: async (req, res) => {
        try {
            const { id } = req.params

            await Cart.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({
                message: "Deleted item from cart",
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}

module.exports = cartController