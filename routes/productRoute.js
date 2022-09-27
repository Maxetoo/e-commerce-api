const express = require('express')
    // const multer = require('multer')
    // const path = require('path')
    // const storage = multer.diskStorage({
    //     destination: function(req, files, cb) {
    //         cb(null, path.join(__dirname, '../uploads'))
    //     },
    //     filename: function(req, file, cb) {
    //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    //         cb(null, file.originalname + '-' + uniqueSuffix)
    //     },
    // })

// const fileFitter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb({ message: 'Unsupported file format' }, false)
//     }
// }

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFitter,
// })
const upload = require('../services/multerSetup')
    // const uploadMultiple = upload.fields([{ name: 'images', maxCount: 8 }])
const uploadMultiple = upload.array('images', 4)
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

productRouter
    .route('/')
    .get(getAllProducts)
    .post(authentication, authorizeAccess('admin', 'merchant'), createProduct)

productRouter
    .route('/uploadImages')
    .post(
        authentication,
        authorizeAccess('admin', 'merchant'),
        uploadMultiple,
        uploadImage
    )

productRouter
    .route('/:id')
    .get(getSingleProduct)
    .patch(authentication, authorizeAccess('admin', 'merchant'), updateProduct)
    .delete(authentication, authorizeAccess('admin', 'merchant'), deleteProduct)

module.exports = productRouter