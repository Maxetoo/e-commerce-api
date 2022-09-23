const jwt = require('jsonwebtoken')

const createJwt = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_LIFESPAN,
    })
}

const signJwt = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN)
}

const createCookies = (res, token) => {
    const accessToken = createJwt(token)
    const targetDay = 3 * (1000 * 60 * 60 * 24)
    return res.cookie('token', accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + targetDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })
}

module.exports = {
    createJwt,
    signJwt,
    createCookies,
}