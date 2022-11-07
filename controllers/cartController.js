const db = require("../models")
const Cart = db.Cart
const cron = require("node-cron")
const emailer = require("../lib/emailer")
const fs = require("fs")
const handlebars = require("handlebars")
const moment = require("moment")

const cartController = {
  addToCart: async (req, res) => {
    const { BookId } = req.body

    const findBookInCart = await Cart.findOne({
      where: {
        BookId: BookId,
      },
    })

    if (findBookInCart) {
      return res.status(400).json({
        message: "You already add this book to your cart",
      })
    }
    const addBookToCart = await Cart.create({
      UserId: req.user.id,
      BookId: BookId,
    })

    const findCart = await Cart.findByPk(addBookToCart.id, {
      include: db.Book,
    })

    return res.status(201).json({
      message: "Book added to cart",
      data: findCart,
    })
  },
  showCartItems: async (req, res) => {
    try {
      const seeAllCartItems = await Cart.findAll({
        include: [{ model: db.Book }],
      })

      return res.status(200).json({
        message: "showBookAtCart",
        data: seeAllCartItems,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  showMyCartItems: async (req, res) => {
    try {
      const { id } = req.params
      const seeAllCartItems = await Cart.findAll({
        include: [{ model: db.Book }],
        where: {
          Userid: req.user.id,
        },
      })

      console.log(seeAllCartItems)

      return res.status(200).json({
        message: "showMyItemCart",
        data: seeAllCartItems,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  deleteBookFromCart: async (req, res) => {
    try {
      const { id } = req.params

      await Cart.destroy({
        where: {
          id: id,
        },
      })
      return res.status(200).json({
        message: "Deleted item from cart",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
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
          id: transactionItemIds,
        },
        include: [{ model: db.Book }],
      })

      let bookIds = []

      const transactionItems = findCarts.map((cart) => {
        const qty = items.find((item) => item.CartId === cart.id).quantity

        bookIds.push(cart.BookId)

        return {
          CartId: cart.id,
          BookId: cart.BookId,
          quantity: qty,
        }
      })

      await db.Book.increment(
        { stock_quantity: -1 },
        {
          where: {
            id: bookIds,
          },
        }
      )

      // let today = new Date();
      // let dd = today.getDate()
      // let mm = today.getMonth() + 1
      // let yyyy = today.getFullYear()
      // let hr = today.getHours()
      // let mn = today.getMinutes()
      // let sc = today.getSeconds()

      // const borrow_date = yyyy + '-' + mm + '-' + dd + ' ' + (hr) + ':' + mn + ':' + sc;

      const borrow_date = moment().format("YYYY-MM-DD hh:mm:ss")

      // const due_date = yyyy + '-' + mm + '-' + (dd + 5) + ' ' + (hr) + ':' + mn + ':' + sc;

      const due_date = moment().add(5, "days").format("YYYY-MM-DD hh:mm:ss")

      let total = 0

      for (let i = 0; i < transactionItemQuantity.length; i++) {
        total += Number(transactionItemQuantity[i])
      }

      const total_quantity = total

      const createTransaction = await db.Transaction.create({
        UserId: req.user.id,
        borrow_date: borrow_date,
        due_date: due_date,
        total_quantity: total_quantity,
      })

      const createTransactionItems = await db.TransactionItem.bulkCreate(
        transactionItems.map((item) => {
          return {
            ...item,
            TransactionId: createTransaction.id,
          }
        })
      )

      const findTransactionById = await db.Transaction.findOne({
        where: {
          UserId: req.user.id,
        },
      })

      const findUserById = await db.User.findByPk(req.user.id)
      const is_penalty = "true"
      const penalty_fee = 20000
      const total_penalty = penalty_fee * total_quantity

      const findTransactionItemsById = await db.TransactionItem.findAll({
        where: {
          TransactionId: createTransaction.id,
        },
        include: [{ model: db.Book }],
      })

      const transactionItemsList = await findTransactionItemsById.map(
        (item) => {
          return {
            title: item.Book.title,
            quantity: item.quantity,
            penalty_fee: penalty_fee.toLocaleString(),
          }
        }
      )
      // const invoiceDate = moment().format("DD MMMM YYYY")

      cron.schedule("0 */5 * * * *", () => {
        if (createTransaction.loan_status === "Waiting for return") {
          db.Transaction.update(
            {
              is_penalty,
              total_penalty,
            },
            {
              where: {
                id: createTransaction.id,
              },
            }
          )

          const rawHTML = fs.readFileSync("templates/invoice.html", "utf-8")
          const compiledHTML = handlebars.compile(rawHTML)
          const resultHTML = compiledHTML({
            invoiceDate: moment().format("DD MMMM YYYY"),
            grandTotal: total_penalty.toLocaleString(),
            transactionItemsList,
          })

          emailer({
            to: findUserById.email,
            html: resultHTML,
            subject: "Loan Penalty",
            text: "Warning: please return the book you borrowed immediately, you will get penalty charge due to exceeding the loan maturity date",
          })
        }
      })

      await db.Cart.destroy({
        where: {
          UserId: req.user.id,
        },
      })

      return res.status(200).json({
        message: "cart checked out",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = cartController
