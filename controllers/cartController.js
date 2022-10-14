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
            message: "Book added to cart",
            data: addBookToCart
        })
    },
    showCartItems: async (req, res) => {
        try {
            const seeAllCartItems = await Cart.findAll({
                include: [{ model: db.Book }],
            })

            return res.status(200).json({
                message: "showBookAtCart",
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
    },
    cartCheckOut: async (req, res) => {
        try {

            let { items } = req.body

            const transactionItemIds = items.map((val) => val.CartId)
            const transactionItemQuantity = items.map((val) => val.quantity)

            const findCarts = await Cart.findAll({
                where: {
                    id: transactionItemIds
                }
            })
            // console.log(transactionItemQuantity)

            const transactionItems = findCarts.map((cart) => {
                const qty = items.find((item) => item.CartId === cart.id).quantity

                return {
                    CartId: cart.id,
                    quantity: qty,
                }
            })

            let today = new Date();
            let dd = today.getDate()
            let mm = today.getMonth() + 1
            let yyyy = today.getFullYear();

            const borrow_date = yyyy + '-' + mm + '-' + dd;

            const due_date = yyyy + '-' + mm + '-' + (dd + 5);

            let total = 0
            for (let i = 0; i < transactionItemQuantity.length; i++) {
                total += Number(transactionItemQuantity[i])
            }
            console.log(total)

            const total_quantity = total

            const createTransaction = await db.Transaction.create({
                UserId: req.user.id,
                borrow_date: borrow_date,
                due_date: due_date,
                total_quantity: total_quantity
            })

            await db.TransactionItem.bulkCreate(
                transactionItems.map((item) => {
                    return {
                        ...item,
                        TransactionId: createTransaction.id
                    }
                })
            )

            return res.status(201).json({
                message: "Cart checked out",
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

