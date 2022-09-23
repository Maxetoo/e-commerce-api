const User = require('../models/userModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { createCookies } = require('../services/helpers')
const register = async(req, res) => {
    const { firstName, lastName, email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser) {
        throw new CustomError.BadRequestError('Email already exist')
    }
    const isAdmin = (await User.countDocuments({})) === 0 ? 'admin' : 'user'
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role: isAdmin,
    })
    const token = {
        name: user.firstName,
        userId: user._id,
        role: user.role,
    }
    createCookies(res, token)
    res.status(StatusCodes.CREATED).json({ user })
}

const login = async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please fill up all credentials')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.BadRequestError('Invalid credentials')
    }
    const checkPassword = await user.comparePassword(password)
    if (!checkPassword) {
        throw new CustomError.BadRequestError('Invalid credentials')
    }

    const token = {
        name: user.firstName,
        userId: user._id,
        role: user.role,
    }
    createCookies(res, token)
    res.status(StatusCodes.OK).json({ user })
}

const logout = async(req, res) => {
    res.send('logout user')
}

module.exports = {
    register,
    login,
    logout,
}