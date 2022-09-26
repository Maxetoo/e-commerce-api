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
    uploadImage,
} = require('../controllers/productController')
const upload = require('../services/multerSetup')

productRouter
    .route('/')
    .get(getAllProducts)
    .post(authentication, authorizeAccess('admin', 'merchant'), createProduct)

productRouter.route('/uploadImages').post(
    authentication,
    authorizeAccess('admin', 'merchant'),
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'image', maxCount: 8 },
    ]),
    uploadImage
)

productRouter
    .route('/:id')
    .get(getSingleProduct)
    .patch(authentication, authorizeAccess('admin', 'merchant'), updateProduct)
    .delete(authentication, authorizeAccess('admin', 'merchant'), deleteProduct)

module.exports = productRouter