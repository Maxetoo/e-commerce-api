const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide image'],
        minLength: 3,
        trim: true,
        unique: true,
    },
    images: {
        type: Array,
        default: ['./images/image.jpg'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
    },
    currency: {
        type: String,
        default: 'NGN',
    },
    colors: {
        type: Array,
        default: [],
    },
    size: {
        type: Array,
        default: [],
    },
    company: {
        type: String,
        minLength: 3,
        maxlength: 20,
        trim: true,
        required: [true, 'Please provide product company'],
    },
    categories: {
        type: Array,
        required: [true, 'Please provide product category'],
    },
    description: {
        type: Array,
        required: [true, 'Please provide product description'],
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inStock: {
        type: Number,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Product', ProductSchema)