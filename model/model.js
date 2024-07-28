const mongoose = require('mongoose')

const Account = {
        nickname: {
                type: String,
                required: true,
        },
        token: {
                type: String,
                required: true,
        },
        gi: {
                type: Boolean,
                required: true,
        },
        hsr: {
                type: Boolean,
                required: true,
        },
        hi3: {
                type: Boolean,
                required: true,
        },
}

module.exports = mongoose.model('Account', Account) // tạo model Account từ schema Account
