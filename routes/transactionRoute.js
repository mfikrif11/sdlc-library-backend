const express = require("express")
const transactionController = require("../controllers/transactionController")

const router = express.Router()

router.get('/', transactionController.showAllTransaction)
router.get('/me', transactionController.showMyTransactionList)
router.patch('/returnStatus/:id', transactionController.returnTransactionLoan)

module.exports = router 