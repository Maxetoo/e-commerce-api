const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be provided'],
    },
    image: {
        type: String,
        required: [true, 'Image should be provided'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity should be provided'],
    },
    size: {
        type: String,
        required: [true, 'Size should be provided'],
    },
    color: {
        type: String,
        required: [true, 'Color should be provided'],
    },
})
const AddressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Please provide delivery address'],
    },
    region: {
        type: String,
        required: [true, 'Please provide region'],
    },
    city: {
        type: String,
        required: [true, 'Please provide city'],
    },
})
const OrderSchema = new mongoose.Schema({
    subtotal: {
        type: Number,
    },
    shipping: {
        type: Number,
    },
    total: {
        type: Number,
    },
    addressDetails: [AddressSchema],
    deliveryMethod: {
        type: String,
        enum: ['Door Delivery', 'Pickup Station'],
    },
    cart: [CartSchema],
    orderStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

module.exports = mongoose.model('Order', OrderSchema)