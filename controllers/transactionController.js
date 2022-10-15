const db = require("../models")
const { Transaction } = db
// const moment = require("moment")
// const emailService = require('../lib/email-service')

const transactionController = {
    showAllTransaction: async (req, res) => {
        try {
            const seeAllTransactionList = await Transaction.findAll()

            return res.status(200).json({
                message: "Show All Transaction",
                data: seeAllTransactionList
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    showMyTransactionList: async (req, res) => {
        try {
            const seeMyTransactionList = await Transaction.findAll({
                where: {
                    UserId: req.user.id
                }
            })

            return res.status(200).json({
                message: "Show All Transaction",
                data: seeMyTransactionList
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    returnTransactionLoan: async (req, res) => {
        try {
            const { loan_status } = req.body
            const { id } = req.params

            const seeMyTransaction = await Transaction.findByPk(id)

            if (loan_status !== "Loan returned") {
                return res.status(400).json({
                    message: "invalid status for transaction",
                })
            }

            let today = new Date();
            let dd = today.getDate()
            let mm = today.getMonth() + 1
            let yyyy = today.getFullYear();
            let hr = today.getHours()
            let mn = today.getMinutes()
            let sc = today.getSeconds()

            const return_date = yyyy + '-' + mm + '-' + dd + ' ' + (hr - 5) + ':' + mn + ':' + sc;

            const is_penalty = "false"

            if (loan_status === "Loan returned") {
                await Transaction.update(
                    {
                        loan_status,
                        return_date,
                        is_penalty
                    },
                    {
                        where: {
                            id: id
                        }
                    }
                )
                return res.status(200).json({
                    message: "Loan returned",
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
}

module.exports = transactionController