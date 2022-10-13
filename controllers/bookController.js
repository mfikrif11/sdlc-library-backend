const db = require("../models")
const { Op } = require("sequelize")

const Book = db.Book

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const { title, author, genre, _sortBy = "id", _sortDir = "ASC", _limit = 10, _page = 1 } = req.query

            if (_sortBy === "title" || _sortBy === "author" || _sortBy === "publish_date" || _sortBy === "genre") {
                const getAll = await Book.findAndCountAll({
                    limit: Number(_limit),
                    offset: (_page - 1) * _limit,
                    attributes: { exclude: ['description'] },
                    order: [
                        [_sortBy, _sortDir]
                    ]
                })

                return res.status(200).json({
                    message: `Get all books sort by ${_sortBy}`,
                    data: getAll.rows,
                    dataCount: getAll.count
                })
            }

            let filterBy = req.params

            if (filterBy = author || genre || title) {
                const getAll = await Book.findAll({
                    attributes: { exclude: ['description'] },
                    where: {
                        [Op.or]: [
                            {
                                author: {
                                    [Op.like]: `%${author}%`
                                }
                            },
                            {
                                title: {
                                    [Op.like]: `%${title}%`
                                }
                            },
                            {
                                genre: {
                                    [Op.like]: `%${genre}%`
                                }
                            }
                        ]
                    }
                })

                return res.status(200).json({
                    message: `book list filtered by ${filterBy}`,
                    data: getAll,
                })
            }

            const getAllBooks = await Book.findAndCountAll({
                limit: Number(_limit),
                offset: (_page - 1) * _limit,
                attributes: { exclude: ['description'] },
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
