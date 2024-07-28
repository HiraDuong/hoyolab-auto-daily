const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/mongoDB')
const cron = require('node-cron')
const PORT = process.env.PORT || 5000

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
        res.sendFile(path.join(__dirname, 'docs/API_document.pdf'))
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
