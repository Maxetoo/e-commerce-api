require('express-async-errors')
require('dotenv').config()

// decleration
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
    // const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')
const NotFoundMiddleware = require('./middlewares/notfoundRoute')
const ErrorMiddleware = require('./middlewares/errorMiddleware')

// middlware tools
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.COOKIE))
app.use(express.static(path.join(__dirname + './uploads')))

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

app.get('/', (req, res) => {
    res.status(200).send('Foot city API')
})

// middlewares
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)
app.use(NotFoundMiddleware)
app.use(ErrorMiddleware)

// port
const port = process.env.PORT || 5000

const startApp = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(port, console.log(`app is listening at port: ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

startApp()