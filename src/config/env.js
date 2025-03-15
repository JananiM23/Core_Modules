require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    mongodb_url: process.env.MONGODB_URL,
    jwtSecret: process.env.JWT_SECRET_KEY,
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASS,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallBackUrl: process.env.GOOGLE_CALLBACK_URL,
    tokenHost : process.env.OAUTH_TOKENHOST,
    authorizationPath : process.env.OAUTH_AUTHORIZATIONPATH,
    tokenPath: process.env.OAUTH_TOKENPATH
}