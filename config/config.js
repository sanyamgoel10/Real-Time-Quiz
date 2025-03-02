module.exports = {
    port: process.env.port,
    
    dbHost: process.env.dbHost,
    dbPort: process.env.dbPort,
    dbName: process.env.dbName,

    EncryptSaltRounds: process.env.EncryptSaltRounds,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,

    MaxQuizQuestions: process.env.MaxQuizQuestions,
}
