const Account = require('../model/model');
const mongoose = require('mongoose');

// Biến để kiểm tra đã chạy lần đầu hay chưa
let isFirstRun = true;

// Hàm chính để thực hiện đăng nhập tự động cho tất cả các tài khoản
async function refreshAccountsAndAutoSignIn() {
    console.log('Thực hiện auto sign-in cho tất cả tài khoản...');
    try {
        const accounts = await Account.find(); // Gọi hàm lấy tất cả tài khoản từ controller
        console.log("lay danh sach tai khoan thanh cong");
        console.log(`Danh sách tài khoản đã lấy: ${accounts}`);
        for (const account of accounts) {
            const hoyolabResponse = await autoSignFunction(account);
            console.log(`${account.nickname} : ${hoyolabResponse} `);
            console.log("--------------------------------------------------");
            // Đặt độ trễ ngẫu nhiên giữa các yêu cầu để tránh hành vi quá nhanh
            await sleep(Math.random() * 1000 + 2000);
        }
    } catch (error) {
        console.error(`Lỗi khi thực hiện auto sign-in: ${error.message}`);
    }
}

// Hàm thực hiện đăng nhập tự động cho từng tài khoản
async function autoSignFunction(account) {
    console.log(`Thực hiện auto sign-in cho tài khoản ${account.nickname}...`);
    const signUrls = {
        gi: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=vi-vn&act_id=e202102251931481",
        hsr: "https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=vi-vn&act_id=e202303301540311",
        hi3: "https://sg-public-api.hoyolab.com/event/mani/sign?lang=vi-vn&act_id=e202110291205111"
    };

    const headers = {
        Cookie: account.token,
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "x-rpc-app_version": "2.34.1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "x-rpc-client_type": "4",
        Referer: "https://act.hoyolab.com/",
        Origin: "https://act.hoyolab.com"
    };

    let response = "";

    for (const [game, url] of Object.entries(signUrls)) {
        if (account[game]) {
            console.log(`Đang thực hiện auto sign-in cho ${game}...`);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                });
                const data = await res.json();
                response += `\n ${game}: ${data.message}`;
            } catch (error) {
                response += `\n ${game}: Error`;
            }
        }
    }
    console.log(`Kết quả auto sign-in cho tài khoản ${account.nickname}: ${response}`);
    return response;
}

// Hàm sleep để đặt độ trễ
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Hàm khởi động lần đầu và lên lịch chạy vào 4h sáng
async function startAndSchedule() {
    try {
        if (isFirstRun) {
            await refreshAccountsAndAutoSignIn(); // Chạy lần đầu khi khởi động server
            isFirstRun = false;
        }
        console.log('startAndSchedule is done');
    } catch (error) {
        console.error(`Lỗi khi khởi động lần đầu và lên lịch: ${error.message}`);
    }
}

// Khởi động server sau khi kết nối DB thành công
async function startServer() {
    try {
        await startAndSchedule(); // Chạy hàm startAndSchedule sau khi server đã khởi động
    } catch (error) {
        console.error(`Lỗi khi khởi động server: ${error.message}`);
    }
    console.log('startServer is done!');
}

module.exports = startServer;