const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, files, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },
})

const fileFitter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb({ message: 'Unsupported file format' }, false)
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
})

// const upload = multer({ dest: 'uploads/' })

module.exports = upload