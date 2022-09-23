const User = require('../models/userModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { allowAccess } = require('../middlewares/authentication')
const makeAdmin = async(req, res) => {
    const { id } = req.params
    const user = await User.findOneAndUpdate({
        _id: id,
    }, {
        role: 'admin',
    }, {
        new: true,
        runValidators: true,
    })
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${id} found`)
    }

    res.status(StatusCodes.OK).json({ user })
}

const makeMerchant = async(req, res) => {
    const { id } = req.params

    const user = await User.findOne({ _id: id })
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${id} found`)
    }

    if (user.role === 'admin') {
        throw new CustomError.BadRequestError(`Cannot make admin a merchant`)
    } else {
        user.role = 'merchant'
        await user.save()
    }

    res.status(StatusCodes.OK).json({ user })
}

const getAllUsers = async(req, res) => {
    const user = await User.find({}).select('-password')
    res.status(StatusCodes.OK).json({ user, count: user.length })
}

const getSingleUser = async(req, res) => {
    const { id } = req.params
    const user = await User.findOne({ _id: id }).select('-password')
    res.status(StatusCodes.OK).json({ user })
}

const showMyProfile = async(req, res) => {
    const userID = req.user.userId
    const user = await User.findOne({
        _id: userID,
    }).select('-password')
    allowAccess(req, user._id)
    console.log(`id: ${userID}, user: ${user._id}`)
    res.status(StatusCodes.OK).json({ user })
}

const updateUserProfile = async(req, res) => {
    const userID = req.user.userId
    const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({ user })
}

const updateUserPassword = async(req, res) => {
    const userID = req.user.userId
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide credentials')
    }
    const user = await User.findOne({
        _id: userID,
    })
    const validatePassword = await user.comparePassword(oldPassword)
    if (!validatePassword) {
        throw new CustomError.BadRequestError('Incorrect password')
    }

    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({ msg: `Password updated successfully!` })
}

const removeSingleUser = async(req, res) => {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id: ${id} found`)
    }

    if (user.role === 'admin') {
        throw new CustomError.BadRequestError(`Can't remove admin`)
    } else {
        await user.delete()
    }
    res.status(StatusCodes.OK).json({
        msg: `user with id: ${id} removed successfully`,
    })
}

module.exports = {
    makeAdmin,
    makeMerchant,
    getAllUsers,
    showMyProfile,
    getSingleUser,
    updateUserProfile,
    updateUserPassword,
    removeSingleUser,
}