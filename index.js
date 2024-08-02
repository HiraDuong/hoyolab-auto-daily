const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/mongoDB')
const puppeteer = require('puppeteer')
const PORT = process.env.PORT || 2000

// Đặt view engine là 'ejs'
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Sử dụng các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cors())

// Route API
app.use('/api', require('./routes/routes'))

const startServer = require('./config/autoDaily')
const tasks = async () => {
        await connectDB()
        await startServer()
}
tasks()

// Route cơ bản
app.get('/', (req, res) => {
        res.render('index')
})
app.get('/account', (req, res) => {
        res.render('account')
})
app.get('/game', (req, res) => {
        res.render('game')
})

app.get('/doc', (req, res) => {
        res.render('doc')
})

let browser
let page

app.get('/proxy', async (req, res) => {
        try {
                // Khởi tạo trình duyệt và trang mới
                browser = await puppeteer.launch({ headless: false })
                page = await browser.newPage()

                // Điều hướng đến trang đăng nhập
                await page.goto('https://www.hoyolab.com/home')

                // Trả lời yêu cầu để thông báo rằng trình duyệt đã được mở
                res.json({
                        message: 'Browser opened. Please log in manually and then click the loginDoneBtn.',
                })
        } catch (error) {
                console.error(error)
                res.status(500).json({
                        error: 'Có lỗi xảy ra khi mở trình duyệt',
                })
        }
})

app.get('/get-cookies', async (req, res) => {
        try {
                if (!page) {
                        return res
                                .status(400)
                                .json({
                                        error: 'Trình duyệt chưa được mở hoặc trang chưa được tải.',
                                })
                }

                // Lấy cookie từ trang đã đăng nhập
                const cookies = await page.cookies()

                // Trả lại cookie cho client
                res.json(cookies)

                // Đóng trình duyệt
                await browser.close()
                browser = null
                page = null
        } catch (error) {
                console.error(error)
                res.status(500).json({
                        error: 'Có lỗi xảy ra khi lấy cookie hoặc đóng trình duyệt',
                })
        }
})

// Ghi log vào tệp log.txt
const logToFile = (message) => {
        const logFilePath = path.join(__dirname, 'log/log.txt')
        fs.appendFile(
                logFilePath,
                `${new Date().toISOString()} - ${message}\n`,
                (err) => {
                        if (err) {
                                console.error(
                                        'Failed to write to log file:',
                                        err,
                                )
                        }
                },
        )
}

app.listen(PORT, () => {
        const message = `Server is running on port ${PORT}`
        console.log(message)
        logToFile(message)
})
