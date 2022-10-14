const db = require("../models")
const moment = require("moment")
const { finished } = require("nodemailer/lib/xoauth2")

const { Transaction, TransactionItem } = db

const transactionController = {
    createNewLoanTransaction: async (req, res) => {
        try {
            let today = new Date();
            let dd = today.getDate()
            let mm = today.getMonth() + 1
            let yyyy = today.getFullYear();

            const borrow_date = yyyy + '-' + mm + '-' + dd;

            const due_date = yyyy + '-' + mm + '-' + (dd + 5);

            const createTransaction = await Transaction.create({
                UserId: req.user.id,
                borrow_date: borrow_date,
                due_date: due_date,
            })

            await TransactionItem.create({
                Cart_Id: Cart_Id
            })

            return res.status(201).json({
                message: "Transaction created"
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    }
}

module.exports = transactionController