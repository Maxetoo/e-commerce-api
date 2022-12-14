const express = require('express')
const orderRouter = express.Router()
const { authentication } = require('../middlewares/authentication')
const {
    getCartItems,
    updateCart,
    checkOut,
    addAddressDetails,
    updateAddressDetails,
    deleteAddressDetails,
    addDeliveryMethod,
    confirmOrder,
    deleteOrder,
} = require('../controllers/orderController')

// checkout is to add cartitems to db cart
orderRouter
    .route('/')
    .get(authentication, getCartItems)
    .post(authentication, checkOut)
    .patch(authentication, updateCart)
    .delete(authentication, deleteOrder)

orderRouter.route('/placeOrder').get(authentication, confirmOrder)
orderRouter
    .route('/addAddressDetails/:id')
    .patch(authentication, addAddressDetails)
orderRouter
    .route('/updateAddressDetails/:id')
    .patch(authentication, updateAddressDetails)
orderRouter
    .route('/deleteAddressDetails/:id')
    .patch(authentication, deleteAddressDetails)

orderRouter
    .route('/addDeliveryMethod/:id')
    .patch(authentication, addDeliveryMethod)

module.exports = orderRouter