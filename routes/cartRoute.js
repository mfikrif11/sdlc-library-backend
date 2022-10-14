const express = require('express')
const cartController = require('../controllers/cartController')

const router = express.Router()

router.post("/", cartController.addToCart)
router.get("/", cartController.showCartItems)
router.delete("/:id", cartController.deleteBookFromCart)
router.post("/checkOut", cartController.cartCheckOut)

module.exports = router