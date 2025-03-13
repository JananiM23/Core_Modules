require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    mongodb_url: process.env.MONGODB_URL,
    jwtSecret: process.env.JWT_SECRET_KEY,
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASS
}