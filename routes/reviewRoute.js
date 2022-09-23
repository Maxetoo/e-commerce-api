const express = require('express')
const reviewRouter = express.Router()
const {
    authentication,
    authorizeAccess,
} = require('../middlewares/authentication')
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    userReviewReply,
    getProductReviews,
    deleteUserReviewReply,
} = require('../controllers/reviewController')

reviewRouter.route('/').get(getAllReviews).post(authentication, createReview)
reviewRouter
    .route('/:id')
    .get(getSingleReview)
    .patch(authentication, updateReview)
    .delete(authentication, deleteReview)
reviewRouter.route('/userReply/:id').patch(authentication, userReviewReply)
reviewRouter
    .route('/deleteUserReply/:id')
    .patch(authentication, deleteUserReviewReply)
reviewRouter.route('/productReviews/:id').get(getProductReviews)

module.exports = reviewRouter