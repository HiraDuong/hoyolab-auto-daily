const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/mongoDB');
const cron = require('node-cron');
const PORT = process.env.PORT || 5000;

// Đặt view engine là 'ejs'
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sử dụng các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());
// Route API
app.use('/api', require('./routes/routes'));

const startServer = require('./config/autoDaily');
const tasks = async () => {
    await connectDB();
    await startServer();
}
 tasks()
// Route cơ bản
app.get('/', (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});