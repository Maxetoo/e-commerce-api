const express = require('express')
const authRouter = express.Router()
const { register, login, logout } = require('../controllers/authController')
const { authentication } = require('../middlewares/authentication')
authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/logout').post(authentication, logout)

module.exports = authRouter