const jwtToken = require("../services/commonService");
const dotenv = require("../config/env");
const OAuth = require("../services/OAuthServices");
const UserModel = require("../models/user");

const axios = require("axios");

exports.OAuthGoogleLogin = async (req, res) => {
  try {
    const authorizationUri = OAuth.authorizeURL({
      redirect_uri: dotenv.googleCallBackUrl,
      scope: ["profile", "email"],
      response_type: "code",
    });
    return res.status(200).send({ redirectURl: authorizationUri });
  } catch (error) {
    console.log(`error:`, error);
    return res.status(500).send({ status: false, message: error });
  }
};

exports.OAuthGoogleCallBack = async (req, res) => {
    const code = decodeURIComponent(req.query.code); // Decode the code
    if (!code) return res.status(403).json({ status: false, message: "Query is undefined" });

    try {
        const tokenParams = new URLSearchParams({
            code,
            redirect_uri: dotenv.googleCallBackUrl,
            client_id: dotenv.googleClientId,
            client_secret: dotenv.googleClientSecret,
            grant_type: "authorization_code"
        });

        const url = "https://oauth2.googleapis.com/token";

        const accessTokenResponse = await axios.post(url, tokenParams.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const accessToken = accessTokenResponse.data.access_token;

        // Fetch user info from Google
        const googleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = {
            _id: googleUser.data.sub,
            email: googleUser.data.email,
            name: googleUser.data.name,
        };

        const token = await jwtToken.jwtTokenGeneration(user);
        if (!token) return res.status(403).json({ status: false, message: "Token generation issue" });

        const userData = await UserModel.create(
            { name: user.name, 
              email: user.email,
              userRole: 2, 
              isApproved: true,
              OAuthUser: true
            }
        )
        
        return res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (error) {
        console.log("Error:", error?.response?.data || error.message);
        return res.status(500).json({
            status: false,
            message: error?.response?.data?.error_description || "Internal Server Error",
        });
    }
};

// testing url content
exports.Dashboard = async (req, res) => {
  try {
    res.json({ message: `Welcome, ${req.user.name}!`, email: req.user.email });
  } catch (error) {
    return res.status(500).send({ status: fasle, message: error });
  }
};
