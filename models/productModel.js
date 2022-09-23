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
        required: [true, 'Please provide image'],
        minLength: 5,
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
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
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
    averageRating: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: [],
}, {
    timestamps: true,
})

module.exports = mongoose.model('Product', ProductSchema)