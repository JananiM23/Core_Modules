const jwtToken = require('../services/commonService');
const dotenv = require('../config/env')

const axios = require('axios')

exports.OAuthGoogleLogin = async (req, res) => {
    try {
        const authorizationUri = oauth2.authorizeURL({
            redirect_uri: dotenv.googleCallBackUrl,
            scope: ["profile", "email"],
            response_type: "code",
          });
          return res.redirect(authorizationUri);
    } catch (error) {
        return res.status(500).send({ status: false, message: error })
    }
}

exports.OAuthGoogleCallBack = async (req, res) => {
    const query = req.query
    if(!query) return res.status(403).send({ status: false, message: "Query is undefined" })
    try {
        const tokenParams = { code, redirect_uri: dotenv.googleCallBackUrl };
        const accessToken = await oauth2.getToken(tokenParams);

        // user info from google 

        const googleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken.token.access_token}` },
          });

        const user = {
            id: googleUser.data.sub, 
            email: googleUser.data.email,
            name: googleUser.data.name,
        }

        const token = await jwtToken.jwtTokenGeneration(user)
        if(!token) return res.status(403).send({ status: false, message : `Token gegenration issue`})

        return res.redirect(`http://localhost:3000/dashboard?token=${token}`)
    } catch (error) {
        return res.status(500).send({ status: fasle , message: error})
    }
}

// testing url content 
exports.Dashboard = async(req, res) => {
    try {
        res.json({ message: `Welcome, ${req.user.name}!`, email: req.user.email });
    } catch (error) {
        return res.status(500).send({ status: fasle , message: error})
    }
}