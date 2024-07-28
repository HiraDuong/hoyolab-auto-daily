const ApiUrl = require('../model/api')

// Tạo một URL API mới
const createApiUrl = async (req, res) => {
        const apiUrl = new ApiUrl({
                url: req.body.url,
                game: req.body.game,
        })

        // Kiểm tra nếu URL đã tồn tại
        const existingApiUrl = await ApiUrl.findOne({ game: req.body.game })
        if (existingApiUrl) {
                return res.status(400).json({ message: 'Game already exists' })
        }

        try {
                const newApiUrl = await apiUrl.save()
                res.status(201).json({
                        message: 'Created Api URL successfully',
                        data: newApiUrl,
                })
        } catch (e) {
                res.status(400).json({ message: e.message })
        }
}

// Lấy tất cả URL API
const getApiUrl = async (req, res) => {
        try {
                const apiUrls = await ApiUrl.find()
                res.json(apiUrls)
        } catch (e) {
                res.status(500).json({ message: e.message })
        }
}

// Xóa một URL API theo ID
const deleteApiUrl = async (req, res) => {
        try {
                const apiUrl = await ApiUrl.deleteOne({ _id: req.params.id })
                if (apiUrl.deletedCount === 0) {
                        return res
                                .status(404)
                                .json({ message: 'Api URL not found' })
                }
                res.json({ message: 'Api URL deleted successfully' })
        } catch (e) {
                res.status(500).json({ message: e.message })
        }
}

// Cập nhật một URL API theo game
const updateApiUrl = async (req, res) => {
        try {
                const apiUrl = await ApiUrl.findOne({ game: req.params.game })

                if (!apiUrl) {
                        return res
                                .status(404)
                                .json({ message: 'Api URL not found' })
                }

                apiUrl.url = req.body.url

                await apiUrl.save()
                res.json(apiUrl)
        } catch (e) {
                res.status(400).json({ message: e.message })
        }
}

module.exports = { createApiUrl, getApiUrl, deleteApiUrl, updateApiUrl }
