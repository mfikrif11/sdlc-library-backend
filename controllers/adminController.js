const db = require("../models")
const admin = db.admin
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")

const adminController = {
  getAllCategories: async (req, res) => {
    try {
      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const seeAllCategory = await db.Category.findAll()

      return res.status(200).json({
        message: "Show All Transaction",
        data: seeAllCategory,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminLogin: async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body

      const findUserByUsernameOrEmail = await db.User.findOne({
        where: {
          [Op.or]: {
            username: usernameOrEmail,
            email: usernameOrEmail,
          },
        },
      })

      if (!findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: "User or email not found",
        })
      }

      // console.log(findUserByUsernameOrEmail.is_admin)

      if (!findUserByUsernameOrEmail.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const passwordValid = bcrypt.compareSync(
        password,
        findUserByUsernameOrEmail.password
      )

      if (!passwordValid) {
        return res.status(400).json({
          message: "password invalid",
        })
      }

      delete findUserByUsernameOrEmail.dataValues.password

      const token = signToken({
        id: findUserByUsernameOrEmail.id,
      })

      return res.status(201).json({
        message: "Login Admin",
        data: findUserByUsernameOrEmail,
        token: token,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminCreateCategory: async (req, res) => {
    try {
      const { category_name } = req.body

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const findCategory = await db.Category.findOne({
        where: {
          category_name: category_name,
        },
      })

      if (findCategory) {
        return res.status(400).json({
          message: "Category name already exist",
        })
      }

      const createNewCategory = await db.Category.create({
        category_name,
      })

      return res.status(201).json({
        message: "Create new category",
        data: createNewCategory,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminUpdateCategory: async (req, res) => {
    try {
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      await db.Category.update(req.body, {
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Category updated",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminDeleteCategory: async (req, res) => {
    try {
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      await db.Category.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Deleted Category",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminBookPost: async (req, res) => {
    try {
      const {
        title,
        author,
        publish_date,
        description,
        CategoryId,
        image_url,
        stock_quantity,
      } = req.body

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const postNewBook = await db.Book.create({
        title,
        author,
        publish_date,
        description,
        CategoryId,
        image_url,
        stock_quantity,
      })

      return res.status(201).json({
        message: "Post new book",
        data: postNewBook,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  adminBookUpdate: async (req, res) => {
    try {
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      await db.Book.update(req.body, {
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Book updated",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  AdminDeleteBook: async (req, res) => {
    try {
      const { id } = req.params

      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      await db.Book.destroy({
        where: {
          id: id,
        },
      })

      return res.status(200).json({
        message: "Deleted book",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  showAllUserTransaction: async (req, res) => {
    try {
      const findAdminById = await db.User.findByPk(req.user.id)

      if (!findAdminById.is_admin) {
        return res.status(400).json({
          message: "User unauthorized",
        })
      }

      const {
        loan_status,
        _sortBy = "borrow_date",
        _sortDir = "ASC",
      } = req.query

      if (loan_status === "Waiting for return") {
        const getTransaction = await db.Transaction.findAll({
          where: { loan_status: "Waiting for return" },
          order: [[_sortBy, _sortDir]],
          include: [
            {
              model: db.TransactionItem,
              include: [{ model: db.Book, include: [{ model: db.Category }] }],
            },
            { model: db.User },
          ],
        })

        return res.status(200).json({
          message: "Find Transaction with Loan status",
          data: getTransaction,
        })
      }
      if (loan_status === "Loan returned") {
        const getTransaction = await db.Transaction.findAll({
          where: { loan_status: "Loan returned" },
          order: [[_sortBy, _sortDir]],
          include: [
            {
              model: db.TransactionItem,
              include: [{ model: db.Book, include: [{ model: db.Category }] }],
            },
            { model: db.User },
          ],
        })

        return res.status(200).json({
          message: "Find Transaction with Loan status",
          data: getTransaction,
        })
      }

      const seeAllTransactionList = await db.Transaction.findAll({
        order: [[_sortBy, _sortDir]],
        include: [
          {
            model: db.TransactionItem,
            include: [{ model: db.Book, include: [{ model: db.Category }] }],
          },
          { model: db.User },
        ],
      })

      return res.status(200).json({
        message: "Show All Transaction",
        data: seeAllTransactionList,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = adminController
