require('dotenv').config();
module.exports = {
    environment: process.env.environment,   // live for production environment

    port: Number(process.env.port),     // Node App Port
    
    dbUri: process.env.MongoDBUri,      // Cloud MongoDB URI (For live environment)

    dbHost: process.env.dbHost,             // Local MongoDB Host
    dbPort: Number(process.env.dbPort),     // Local MongoDB Port
    dbName: process.env.dbName,             // MongoDB Database name

    EncryptSaltRounds: Number(process.env.EncryptSaltRounds),   // bcrypt Salt

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,         // JWT Secret
    TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,     // JWT Header key

    MaxQuizQuestions: Number(process.env.MaxQuizQuestions), // Quiz Questions Configurable
}