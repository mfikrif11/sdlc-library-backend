const express = require('express')
const cartController = require('../controllers/cartController')
const { verifyToken } = require('../middlewares/authMiddleware')


const router = express.Router()

router.post("/", cartController.addToCart)
router.get("/", cartController.showCartItems)
router.delete("/:id", cartController.deleteBookFromCart)

module.exports = router