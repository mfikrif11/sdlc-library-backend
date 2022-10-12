const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const cors = require("cors")
const fs = require("fs")
const handlebars = require("handlebars")
const authRoute = require("./routes/authRoute")
const bookRoute = require("./routes/bookRoute")


dotenv.config()

const PORT = 2000

const app = express()

app.use(cors())
app.use(express.json())


app.use("/auth", authRoute)
app.use("/books", bookRoute)

app.listen(PORT, async () => {
    db.sequelize.sync({ alter: true })
    console.log("Listening in Port", PORT)
})
