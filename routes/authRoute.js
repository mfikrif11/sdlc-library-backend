const authController = require("../controllers/authController")
const express = require("express")
const router = express.Router()

router.get("/", authController.getAllBooks)

module.exports = router
