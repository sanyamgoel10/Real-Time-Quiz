const config = require("./config/config.js");
const PORT = config.port || 3000;
const { connectDB } = require("./services/db.js");
const app = require("./app.js");

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, async () => {
            console.log(`Server is running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();