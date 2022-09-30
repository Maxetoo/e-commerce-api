const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const getCartItems = async(req, res) => {
    const userID = req.user.userId
    const order = await Order.find({
        user: userID,
    })
    res.status(StatusCodes.OK).json({ order })
}

const checkOut = async(req, res) => {
    const { cart, subtotal, shipping, total } = req.body
    req.body.user = req.user.userId
    for (const item of cart) {
        const checkProductExist = await Product.find({
            name: item.name,
        })
        if (checkProductExist.length !== cart.length)
            throw new CustomError.BadRequestError(
                `This cart contains a product that does'nt exist`
            )
    }
    if (!cart || !subtotal || !shipping || !total)
        throw new CustomError.BadRequestError(`Your cart is empty`)
    const order = await Order.create(req.body)
    res.status(StatusCodes.CREATED).json({ order })
}

const updateCart = async(req, res) => {
    const userID = req.user.userId

    const findOrder = await Order.findOne({
        user: userID,
    })
    if (!findOrder)
        throw new CustomError.NotFoundError(`You don't have any order to modify`)
    const order = await Order.findOneAndUpdate({
        user: userID,
    }, {
        cart: req.body,
    }, {
        new: true,
    })
    res.status(StatusCodes.OK).json({ order })
}

const addAddressDetails = async(req, res) => {
    const { id } = req.params
    const userId = req.user.userId
    const showProfile = await User.findOne({
        _id: userId,
    })
    const { firstName, lastName, email } = showProfile
    req.body.firstName = firstName
    req.body.lastName = lastName
    req.body.email = email

    const findOrder = await Order.findOne({ _id: id })
    if (!findOrder)
        throw new CustomError.NotFoundError(`Order with id : ${id} not found`)
    const order = await Order.updateOne({
        user: userId,
        _id: id,
    }, {
        $push: {
            addressDetails: req.body,
        },
    }, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ order })
}

const updateAddressDetails = async(req, res) => {
    const { id } = req.params
    const { updateId } = req.body
    const findOrder = await Order.findOne({ _id: id })
    if (!findOrder)
        throw new CustomError.NotFoundError(`Order with id : ${id} not found`)

    if (!updateId)
        throw new CustomError.BadRequestError(
            `Address updateId needs to be provided`
        )
    const getOrder = await Order.findOne({
        'addressDetails._id': updateId,
    })
    if (!getOrder)
        throw new CustomError.NotFoundError(`Order with id : ${updateId} not found`)
    await Order.updateOne({
        'addressDetails._id': updateId,
    }, {
        $set: {
            'addressDetails.$': req.body,
        },
    }, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({
        msg: 'Address details updated successfully!',
    })
}

const deleteAddressDetails = async(req, res) => {
    const { id } = req.params
    const userId = req.user.userId
    const { deleteId } = req.body
    if (!deleteId)
        throw new CustomError.BadRequestError(
            `Address deleteId needs to be provided`
        )

    const findOrder = await Order.findOne({ _id: id })
    if (!findOrder)
        throw new CustomError.NotFoundError(`Order with id : ${id} not found`)

    const getOrder = await Order.findOne({
        'addressDetails._id': deleteId,
    })

    if (!getOrder)
        throw new CustomError.NotFoundError(`Order with id : ${deleteId} not found`)

    await Order.updateOne({
        user: userId,
        _id: id,
    }, {
        $pull: {
            addressDetails: {
                _id: deleteId,
            },
        },
    })
    res.status(StatusCodes.OK).json({
        msg: 'Address details deleted successfully!',
    })
}

const addDeliveryMethod = async(req, res) => {
    const { id } = req.params
    const userId = req.user.userId
    const { deliveryMethod } = req.body
    if (!deliveryMethod)
        throw new CustomError.BadRequestError(`Delivery method must be provided`)
    const findOrder = await Order.findOne({ _id: id })
    if (!findOrder)
        throw new CustomError.NotFoundError(`Order with id : ${id} not found`)
    const order = await Order.findOneAndUpdate({
        user: userId,
        _id: id,
    }, {
        deliveryMethod,
    }, {
        new: true,
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({ order })
}

const confirmOrder = async(req, res) => {
    const userId = req.user.userId
    const order = await Order.findOne({
        user: userId,
    })
    const { addressDetails, cart, deliveryMethod, total } = order
    if (addressDetails.length < 1 || !cart || !deliveryMethod || !total)
        throw new CustomError.BadRequestError(`Please fill up credentials`)

    res.status(StatusCodes.OK).json({ msg: `Proceed to payment` })
}

const deleteOrder = async(req, res) => {
    const userId = req.user.userId
    await Order.findOneAndDelete({
        user: userId,
    })
    res.status(StatusCodes.OK).json({
        msg: `Order deleted succesfully!`,
    })
}

module.exports = {
    getCartItems,
    updateCart,
    checkOut,
    addAddressDetails,
    updateAddressDetails,
    deleteAddressDetails,
    addDeliveryMethod,
    confirmOrder,
    deleteOrder,
}