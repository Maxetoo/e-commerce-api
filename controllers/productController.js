const Product = require('../models/productModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

const createProduct = async(req, res) => {
    const { name } = req.body
    req.body.user = req.user.userId

    const findProduct = await Product.findOne({
        name,
        user: {
            _id: req.user.userId,
        },
    })
    if (findProduct) {
        throw new CustomError.BadRequestError(
            `This product name already exist from you`
        )
    } else {
        const product = await Product.create(req.body)
        res.status(StatusCodes.CREATED).json({ product })
    }
}

const getAllProducts = async(req, res) => {
    const { sort, search, page, limit = 10, select } = req.query
    const products = await Product.find({
            name: {
                $regex: search || '',
                $options: 'i',
            },
        })
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(limit + (page - 1))

    res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async(req, res) => {
    const { id } = req.params
    const product = await Product.findOne({ _id: id }).populate({
        path: 'user',
        select: '_id firstName role',
    })

    if (!product)
        throw new CustomError.NotFoundError(`No product with id: ${id} found`)
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async(req, res) => {
    const { id } = req.params
    const { name } = req.body
    req.body.user = req.user.userId
    const findProduct = await Product.findOne({
        name,
        user: {
            _id: req.user.userId,
        },
    })
    if (findProduct) {
        throw new CustomError.BadRequestError(
            `This product name already exist from you`
        )
    } else {
        const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(StatusCodes.OK).json({ product })
    }
}

const deleteProduct = async(req, res) => {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product)
        throw new CustomError.NotFoundError(`No product with id: ${id} found`)
    await product.delete()
    res
        .status(StatusCodes.OK)
        .json({ msg: `Product with id: ${id} deleted succesfully!` })
}

const uploadImage = async(req, res) => {
    let urls = []
    const imageFiles = req.files
    for (const files of imageFiles) {
        const filePath = path.join(__dirname, `../uploads/${files.filename}`)
        const newPath = await cloudinary.uploader.upload(filePath, {
            use_filename: true,
            folder: 'e-commerce',
        })
        urls.push(newPath.secure_url)
        fs.unlinkSync(filePath)
    }

    res.status(StatusCodes.OK).json({
        src: urls,
    })
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}