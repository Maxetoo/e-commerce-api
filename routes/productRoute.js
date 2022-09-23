const express = require('express')
const productRouter = express.Router()
const {
    authentication,
    authorizeAccess,
} = require('../middlewares/authentication')
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController')

productRouter
    .route('/')
    .get(getAllProducts)
    .post(authentication, authorizeAccess('admin', 'merchant'), createProduct)

productRouter
    .route('/:id')
    .get(getSingleProduct)
    .patch(authentication, authorizeAccess('admin', 'merchant'), updateProduct)
    .delete(authentication, authorizeAccess('admin', 'merchant'), deleteProduct)

module.exports = productRouter