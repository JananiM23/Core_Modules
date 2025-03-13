const mongoose = require('mongoose');
const {mongodb_url} = require('./env');

const dbConnection = async () => {
    try {
        await mongoose.connect(mongodb_url,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        );

        console.log("MongoDB connected successfully");
        
    } catch(error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = dbConnection;