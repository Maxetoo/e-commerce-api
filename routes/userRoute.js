const express = require('express')
const userRouter = express.Router()
const {
    makeAdmin,
    makeMerchant,
    getAllUsers,
    getSingleUser,
    showMyProfile,
    updateUserProfile,
    updateUserPassword,
    removeSingleUser,
} = require('../controllers/userController')
const {
    authentication,
    adminOnlyAccess,
} = require('../middlewares/authentication')

userRouter.route('/').get(authentication, adminOnlyAccess('admin'), getAllUsers)
userRouter.route('/profile').get(authentication, showMyProfile)
userRouter.route('/update-profile').patch(authentication, updateUserProfile)
userRouter.route('/update-password').patch(authentication, updateUserPassword)
userRouter
    .route('/:id')
    .get(getSingleUser)
    .delete(authentication, adminOnlyAccess('admin'), removeSingleUser)

userRouter
    .route('/make-admin/:id')
    .patch(authentication, adminOnlyAccess('admin'), makeAdmin)

userRouter
    .route('/make-merchant/:id')
    .patch(authentication, adminOnlyAccess('admin'), makeMerchant)
module.exports = userRouter