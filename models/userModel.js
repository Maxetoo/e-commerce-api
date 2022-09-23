const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const UserModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        minLength: 3,
        maxLength: 11,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        minLength: 3,
        maxLength: 11,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: (props) => `${props.value} is not a valid email`,
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 5,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'merchant'],
        default: 'user',
    },
}, { timestamps: true })

UserModel.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt()
    return (this.password = await bcrypt.hash(this.password, salt))
})

UserModel.methods.comparePassword = async function(password) {
    const checkPassword = await bcrypt.compare(password, this.password)
    return checkPassword
}

module.exports = mongoose.model('User', UserModel)