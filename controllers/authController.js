const db = require("../models")

const Book = db.Book

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const getAll = await Book.findAll({})

            return res.status(200).json({
                message: "Get all books",
                data: getAll,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
}

module.exports = bookController
