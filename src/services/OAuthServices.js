const { AuthorizationCode } = require('simple-oauth2')
const dotenv = require('../config/env')

exports.OAuth = new AuthorizationCode({
    client : {
        id: dotenv.googleClientId,
    secret: dotenv.googleClientSecret
    },
    auth: {
        tokenHost: dotenv.tokenHost,
        authorizePath: dotenv.authorizationPath,
        tokenPath: dotenv.tokenPath,
      },
}) 