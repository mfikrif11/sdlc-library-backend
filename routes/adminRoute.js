const express = require("express")
const adminController = require("../controllers/adminController")
const { verifyToken } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/login", adminController.adminLogin)
router.get("/book-categories", verifyToken, adminController.getAllCategories)
router.post(
  "/book-categories",
  verifyToken,
  adminController.adminCreateCategory
)
router.patch(
  "/book-categories/:id",
  verifyToken,
  adminController.adminUpdateCategory
)
router.delete(
  "/book-categories/:id",
  verifyToken,
  adminController.adminDeleteCategory
)
router.post("/books", verifyToken, adminController.adminBookPost)
router.patch("/books/:id", verifyToken, adminController.adminBookUpdate)
router.delete("/books/:id", verifyToken, adminController.AdminDeleteBook)
router.get(
  "/user-transactions",
  verifyToken,
  adminController.showAllUserTransaction
)

module.exports = router
