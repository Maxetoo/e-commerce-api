const { StatusCodes } = require('http-status-codes')
const { signJwt } = require('../services/helpers')
const CustomError = require('../errors')

const authentication = (req, res, next) => {
    const authToken = req.signedCookies.token
    if (!authToken) {
        throw new CustomError.UnauthorizedError('Not authorized')
    }
    const { name, userId, role } = signJwt(authToken).payload
    req.user = {
        name,
        userId,
        role,
    }
    next()
}

const adminOnlyAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorised Error')
        }
        next()
    }
}

const authorizeAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorised Error')
        }
        next()
    }
}

const allowAccess = (req, userAuth) => {
    const user = req.user.userId
    const role = req.user.role
    if (role === 'admin') return
    if (user === userAuth.toString()) return
    throw new CustomError.UnauthorizedError('Unauthorized Error')
}

module.exports = {
    authentication,
    adminOnlyAccess,
    authorizeAccess,
    allowAccess,
}