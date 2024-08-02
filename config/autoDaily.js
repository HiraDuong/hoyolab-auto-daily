const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')
const cron = require('node-cron')
const Account = require('../model/model')
const ApiUrl = require('../model/api')

// Đường dẫn tới tệp log
const logFilePath = path.join(__dirname, '../log/log.txt')

// Hàm ghi log vào tệp
const logToFile = (message) => {
        const vietnamTime = moment()
                .tz('Asia/Ho_Chi_Minh')
                .format('YYYY-MM-DD HH:mm:ss')
        fs.appendFile(logFilePath, `${vietnamTime} - ${message}\n`, (err) => {
                if (err) {
                        console.error('Failed to write to log file:', err)
                }
        })
}

// Hàm xóa log
const clearLogFile = () => {
        fs.writeFile(logFilePath, '', (err) => {
                if (err) {
                        console.error('Failed to clear log file:', err)
                } else {
                        logToFile('Log file cleared.')
                }
        })
}

// Biến để kiểm tra đã chạy lần đầu hay chưa
let isFirstRun = true

// Hàm chính để thực hiện đăng nhập tự động cho tất cả các tài khoản
async function refreshAccountsAndAutoSignIn() {
        logToFile(`\n
            ----------------------------------------------\n
            |                                            |
            |    START ON : ${moment()
                    .tz('Asia/Ho_Chi_Minh')
                    .format('YYYY-MM-DD')} |\n
            |                                            |
            ++++++++++++++++++++++++++++++++++++++++++++++\n`)
        logToFile('Thực hiện auto sign-in cho tất cả tài khoản...')

        try {
                const accounts = await Account.find() // Gọi hàm lấy tất cả tài khoản từ controller
                logToFile('Lấy danh sách tài khoản thành công')
                accounts.map((account, key) => {
                        logToFile(
                                '--------------------------------------------------\n',
                        )
                        logToFile(
                                `Danh sách tài khoản đã lấy: ${JSON.stringify(
                                        key +
                                                '-' +
                                                account.nickname +
                                                '-' +
                                                account,
                                )}`,
                        )
                })
                for (const account of accounts) {
                        await sleep(Math.random() * 240000 + 60000) // Độ trễ từ 1 đến 5 phút
                        logToFile(
                                '--------------------------------------------------',
                        )
                        // Đặt độ trễ ngẫu nhiên giữa các yêu cầu để tránh hành vi quá nhanh
                }
        } catch (error) {
                logToFile(`Lỗi khi thực hiện auto sign-in: ${error.message}`)
        }
        logToFile(
                `END AT : ${moment()
                        .tz('Asia/Ho_Chi_Minh')
                        .format('YYYY-MM-DD HH:mm:ss')}`,
        )
}

// get api url
const defaultSignUrls = [
        {
                game: 'gi',
                url: 'https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=vi-vn&act_id=e202102251931481',
        },
        {
                game: 'hsr',
                url: 'https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=vi-vn&act_id=e202303301540311',
        },
        {
                game: 'hi3',
                url: 'https://sg-public-api.hoyolab.com/event/mani/sign?lang=vi-vn&act_id=e202110291205111',
        },
        {
                game: 'zzz',
                url: 'https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign?lang=vi-vn&act_id=e202406031448091',
        },
]

const getSignUrls = async () => {
        try {
                const games = await ApiUrl.find()
                console.log('GAME', games)

                if (games.length > 0) {
                        // Xử lý apiUrl dựa trên dữ liệu trả về
                        logToFile('Lấy api game thành công')
                        games.map((game, key) => {
                                logToFile(
                                        `Danh sách game đã lấy: ${JSON.stringify(key + '--' + game.game + '-' + game.url)}`,
                                )
                                logToFile(
                                        '--------------------------------------------------',
                                )
                        })
                        return games.map((game) => ({
                                game: game.game,
                                url: game.url,
                        }))
                } else {
                        // Nếu không có dữ liệu, lưu giá trị mặc định vào cơ sở dữ liệu
                        logToFile(
                                'Không có dữ liệu từ cơ sở dữ liệu. Lưu giá trị mặc định...',
                        )
                        await ApiUrl.insertMany(defaultSignUrls)
                        logToFile(
                                'Lưu giá trị mặc định vào cơ sở dữ liệu thành công.',
                        )
                        return defaultSignUrls
                }
        } catch (error) {
                // Ghi log lỗi và trả về giá trị mặc định nếu có lỗi
                console.error(
                        `Lỗi khi thực hiện auto sign-in: ${error.message}`,
                )
                return defaultSignUrls
        }
}

// Hàm thực hiện đăng nhập tự động cho từng tài khoản
async function autoSignFunction(account) {
        logToFile(`Thực hiện auto sign-in cho tài khoản ${account.nickname}...`)

        const signUrls = await getSignUrls()
        if (!signUrls) {
                return 'Error: Không tìm thấy dữ liệu apiUrl'
        }
        console.log('Final Sign URLs:', signUrls)
        const headers = {
                Cookie: account.token,
                Accept: 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
                'x-rpc-app_version': '2.34.1',
                'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
                'x-rpc-client_type': '4',
                Referer: 'https://act.hoyolab.com/',
                Origin: 'https://act.hoyolab.com',
        }

        let response = ''

        for (const { game, url } of signUrls) {
                if (account[game]) {
                        logToFile(`Đang thực hiện auto sign-in cho ${game}...`)
                        try {
                                const res = await fetch(url, {
                                        method: 'POST',
                                        headers: headers,
                                })
                                const data = await res.json()
                                response += `\n ${game}: ${data.message}`
                        } catch (error) {
                                response += `\n ${game}: Error`
                        }
                }
        }
        logToFile(
                `Kết quả auto sign-in cho tài khoản ${account.nickname}: ${response}`,
        )
        return response
}

// Hàm sleep để đặt độ trễ
function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
}

// Hàm khởi động lần đầu và lên lịch chạy vào 3:00 sáng
async function startAndSchedule() {
        try {
                if (isFirstRun) {
                        await refreshAccountsAndAutoSignIn() // Chạy lần đầu khi khởi động server
                        isFirstRun = false
                }
                logToFile('startAndSchedule is done')
        } catch (error) {
                logToFile(
                        `Lỗi khi khởi động lần đầu và lên lịch: ${error.message}`,
                )
        }
}

// Thiết lập lịch trình để chạy vào lúc 3:00 sáng hàng ngày
cron.schedule('0 3 * * *', async () => {
        logToFile('Thực hiện nhiệm vụ định kỳ lúc 3:00 sáng...')
        try {
                await refreshAccountsAndAutoSignIn()
                logToFile('Lên lịch chạy thành công')
        } catch (error) {
                logToFile(
                        `Lỗi khi thực hiện nhiệm vụ định kỳ: ${error.message}`,
                )
        }
})

// Thiết lập lịch trình để xóa log mỗi 7 ngày vào lúc 12:00 AM
cron.schedule('0 0 */7 * *', () => {
        logToFile('Thực hiện xóa log file định kỳ mỗi 7 ngày...')
        clearLogFile()
})

// Khởi động server sau khi kết nối DB thành công
async function startServer() {
        try {
                await startAndSchedule() // Chạy hàm startAndSchedule sau khi server đã khởi động
        } catch (error) {
                logToFile(`Lỗi khi khởi động server: ${error.message}`)
        }
        logToFile('Lên lịch chạy thành công')
}

module.exports = startServer
