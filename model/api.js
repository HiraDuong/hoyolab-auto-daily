const mongoose = require('mongoose')

const ApiUrl = {
        url: {
                type: String,
                required: true,
        },
        game: {
                type: String,
                required: true,
        },
}

module.exports = mongoose.model('ApiUrl', ApiUrl) // tạo model ApiList từ schema apiList
