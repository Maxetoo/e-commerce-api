const Product = require('../models/productModel')
const Review = require('../models/reviewModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { allowAccess } = require('../middlewares/authentication')

const createReview = async(req, res) => {
    const { product: productId } = req.body
    req.body.user = req.user.userId
    const product = await Product.findOne({ _id: productId })
    if (!product)
        throw new CustomError.NotFoundError(`Product with id: ${id} not found`)
    const alreadyCreated = await Review.findOne({
        user: req.user.userId,
        product: productId,
    })
    if (alreadyCreated)
        throw new CustomError.BadRequestError(`Review created already`)
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({ review })
}

const userReviewReply = async(req, res) => {
    const { id: reviewId } = req.params
    req.body.user = req.user.userId
    const { comment } = req.body
    const review = await Review.findOne({
        _id: reviewId,
    })

    if (!review)
        throw new CustomError.NotFoundError(`Review with id: ${reviewId} not found`)
    if (!comment)
        throw new CustomError.BadRequestError(
            `Please provide reply to this comment`
        )
    const alreadyCreated = await Review.findOne({
        'replies.user': req.user.userId,
    })
    if (alreadyCreated) {
        throw new CustomError.BadRequestError(
            `Reply to this comment already created`
        )
    } else {
        await Review.updateOne({ _id: reviewId }, {
            $push: {
                replies: req.body,
            },
        }, {
            runValidators: true,
        })
        res.status(StatusCodes.CREATED).json({ msg: `Reply created successfully` })
    }
}

const deleteUserReviewReply = async(req, res) => {
    const { id: reviewId } = req.params
    const { deleteId } = req.body
    const review = await Review.findOne({
        _id: reviewId,
    })

    if (!review)
        throw new CustomError.NotFoundError(`Review with id: ${reviewId} not found`)
    if (!deleteId)
        throw new CustomError.BadRequestError(`Reply deleteId needs to be provided`)
    const findUserReply = await Review.findOne({
        'replies._id': deleteId,
    })
    if (!findUserReply)
        throw new CustomError.NotFoundError(
            `This review reply has already been deleted`
        )
    allowAccess(req, review.replies.user)

    await Review.updateOne({ _id: reviewId }, {
        $pull: {
            replies: {
                _id: deleteId,
            },
        },
    }, {
        runValidators: true,
    })
    res.status(StatusCodes.OK).json({
        msg: `Reply deleted succesfully`,
    })
}

const getAllReviews = async(req, res) => {
    const reviews = await Review.find({})
        .sort('createdAt')
        .populate({
            path: 'user',
            select: '_id firstName',
        })
        .populate({
            path: 'replies.user',
            select: '_id firstName',
        })
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async(req, res) => {
    const { id } = req.params
    const review = await Review.findOne({
        _id: id,
    }).populate({ path: 'user', select: '_id firstName email' })
    if (!review)
        throw new CustomError.NotFoundError(`Review with id: ${id} not found`)

    res.status(StatusCodes.OK).json({
        review,
    })
}

const getProductReviews = async(req, res) => {
    const { id } = req.params
    const reviews = await Review.find({ product: id })
    if (!reviews)
        throw new CustomError.NotFoundError(
            `Product review with id: ${id} not found`
        )
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const updateReview = async(req, res) => {
    const { id } = req.params
    const { title, comment, rating } = req.body
    const review = await Review.findOne({
        _id: id,
    })
    if (!review)
        throw new CustomError.NotFoundError(`Review with id: ${id} not found`)
    review.title = title
    review.comment = comment
    review.rating = rating
    review.reply = []
    await review.save()
    res.status(StatusCodes.OK).json({
        review,
    })
}

const deleteReview = async(req, res) => {
    const { id } = req.params
    const review = await Review.findOne({ _id: id })
    if (!review)
        throw new CustomError.NotFoundError(`Review with id: ${id} not found`)
    await review.delete()
    res.status(StatusCodes.OK).json({
        msg: `Review deleted successfully!`,
    })
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    userReviewReply,
    getProductReviews,
    deleteUserReviewReply,
}