require('dotenv').config();
module.exports = {
    environment: process.env.environment,

    port: Number(process.env.port),
    
    dbUri: process.env.MongoDBUri,

    dbHost: process.env.dbHost,
    dbPort: Number(process.env.dbPort),
    dbName: process.env.dbName,

    EncryptSaltRounds: Number(process.env.EncryptSaltRounds),

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,

    MaxQuizQuestions: Number(process.env.MaxQuizQuestions),
}