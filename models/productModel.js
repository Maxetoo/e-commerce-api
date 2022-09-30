const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        trim: true,
        unique: true,
    },
    images: {
        type: Array,
        default: [
            'https://res.cloudinary.com/dfamily/image/upload/v1664207221/e-commerce/BEGINNING_wzqtfz.jpg',
        ],
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
        required: [true, 'Please provide how many products are in stock'],
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

ProductSchema.pre('remove', async function() {
    await this.model('Review').deleteMany({
        product: this._id,
    })
})

module.exports = mongoose.model('Product', ProductSchema)