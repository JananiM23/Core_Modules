const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require('./middleware/rateLimit');
const dbConnection = require('./config/db');
const dotenv = require('./config/env');
const logger = require('./utils/logger');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userManagementRoute');
const OAuth = require('./routes/OAuthRoute');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
dbConnection();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use('/api/OAuth', OAuth);

app.use(require("./middleware/errorHandler"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(dotenv.port, () => {
    console.log(`Server connected on PORT ${dotenv.port}`);
    console.log("Swagger API Docs available at: http://localhost:5000/api-docs");
    logger.info(`Server connected on PORT ${dotenv.port}`);
});