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
const rateLimiter = require('express-rate-limit')
const path = require('path')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary').v2
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')
const NotFoundMiddleware = require('./middlewares/notfoundRoute')
const ErrorMiddleware = require('./middlewares/errorMiddleware')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
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
    res
        .status(200)
        .send(`<h1>Foot City Api</h1><a href="/api-docs">Documentation</a>`)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// middlewares
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)
app.use(NotFoundMiddleware)
app.use(ErrorMiddleware)

app.set('trust proxy', 1)
app.use(
        rateLimiter({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100,
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false,
        })
    )
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