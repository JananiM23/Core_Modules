const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require('./middleware/rateLimit');
const dbConnection = require('./config/db');
const dotenv = require('./config/env');
const logger = require('./utils/logger');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userManagementRoute');

const app = express();
dbConnection();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use(require("./middleware/errorHandler"));

app.listen(dotenv.port, () => {
    console.log(`Server connected on PORT ${dotenv.port}`);
    logger.info(`Server connected on PORT ${dotenv.port}`);
});