const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
})

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide review title'],
        trim: true,
    },
    comment: {
        type: String,
        required: [true, 'Please provide review comment'],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    replies: [ReplySchema],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },
}, {
    timestamps: true,
})

ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)