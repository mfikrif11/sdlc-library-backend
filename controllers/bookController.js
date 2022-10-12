const db = require("../models")
const { Op } = require("sequelize")

const Book = db.Book

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const { _sortBy, title, author, genre, _sortDir = "ASC" } = req.query

            if (_sortBy === "title" || _sortBy === "author" || _sortBy === "publish_date" || _sortBy === "genre") {
                const getAll = await Book.findAll({
                    attributes: { exclude: ['description'] },
                    order: [
                        [_sortBy, _sortDir]
                    ]
                })

                return res.status(200).json({
                    message: `Get all books sort by ${_sortBy}`,
                    data: getAll,
                })
            }

            if (title) {
                const getAll = await Book.findAll({
                    attributes: { exclude: ['description', 'genre'] },
                    where: {
                        title: {
                            [Op.like]: `%${title}%`
                        }
                    }
                })

                return res.status(200).json({
                    message: "Get books by title",
                    data: getAll,
                })
            }

            if (author) {
                const getAll = await Book.findAll({
                    attributes: { exclude: ['description', 'genre'] },
                    where: {
                        author: {
                            [Op.like]: `%${author}%`
                        }
                    }
                })

                return res.status(200).json({
                    message: "Get books by Author",
                    data: getAll,
                })
            }

            if (genre) {
                const getAll = await Book.findAll({
                    attributes: { exclude: ['description'] },
                    where: {
                        genre: {
                            [Op.like]: `%${genre}%`
                        }
                    }
                })

                return res.status(200).json({
                    message: "Get books by Author",
                    data: getAll,
                })
            }

            const { _limit = 10, _page = 1 } = req.query

            const getAllBooks = await Book.findAndCountAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
            })

            return res.status(200).json({
                message: "Get all posts",
                data: getAllBooks.rows,
                dataCount: getAllBooks.count
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    },
    getBookDetailsByid: async (req, res) => {
        try {
            const { id } = req.params

            const findBookById = await Book.findByPk(id)

            return res.status(200).json({
                message: "Get book details",
                data: findBookById
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error",
            })
        }
    }
}


module.exports = bookController
