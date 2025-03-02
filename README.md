# Real-Time-Quiz
- A real-time quiz game where two players compete against each other.
- Each player is presented with the same set of questions in sequence, and they answer these questions independently. 
- The player who scores the highest among the both of the players wins.

## Steps to run:
#### 1. Clone the repository:
```ssh
git clone https://github.com/sanyamgoel10/Real-Time-Quiz.git
```
#### 2. Install dependencies:
```ssh
npm install
```
#### 3. Add config/config.js file
```ssh
// Sample config file
module.exports = {
    port: 3000,                             // Node App Port
    
    dbHost: "localhost",                    // MongoDB Host
    dbPort: 27017,                          // MongoDB Port
    dbName: "quiz_db",                      // MongoDB DatabaseName

    EncryptSaltRounds: 10,                  // BCRYPT Password Encryption Salt Rounds

    JWT_SECRET_KEY: "jwt_secret_key_sg",    // JWT Secret key
    TOKEN_HEADER_KEY: "jwt_header_key_sg",  // JWT Header key

    MaxQuizQuestions: 4,                    // Maximum Quiz Questions
}
```
#### 4. Run the application:
```ssh
node server
```
#### 5. Open Browser:
In browser, Open `http://localhost:{PORT}` to run the application. Replace `{PORT}` in link with the value of `port` in config file.

## Features
#### 1. **User Management**
- *User registration*: Users can register by providing a username and password.
- *Password storage*: Passwords are securely stored using bcrypt hashing, ensuring that even if the database is compromised, user passwords are not exposed.
#### 2. **Search Quiz**
A new user searched for an active quiz.
#### 3. **Join Quiz**
A user is joined to a quiz room when they start game.
#### 4. **Quiz Game Session**
During an active quiz game session, users are presented with questions one by one and have to submit the answer during a specific time of 20 secods before the next question pops up.
#### 5. **Quiz Ends**
Each user is shown the winner when all questions are complete and user is redirected to landing page.

## Technologies Used
- **Backend Framework**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT
- **Cryptography**: bcrypt

## Security and Cryptography
- **Password hashing**: User passwords are hashed using bcrypt before being stored in the database. This ensures passwords are never stored in plaintext. 
- **Password validation**: During login or when performing actions like borrowing or returning books, the entered password is compared to the hashed password in the database using bcrypt's `compare` method.