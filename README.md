# Chat Room Application

## 📌 Project Overview
This is the WebSocket-based chat backend that supports real-time messaging, including room join/leave events and user authentication.

## Features

### 1. Real-time messaging with Socket.io

### 2. Room-based communication (e.g., general, admin, tech)

### 3. Join & Leave Notifications

### 4. User Authentication using JWT

### 5. Message History persistence

## 🚀 Getting Started

### 1. Clone the Repository
``` 
git clone git@github.com:Zobamba/chat-app.git
cd <your-project-folder> 
```

### 2. Install Dependencies
Ensure you have Node.js installed, then run:

``` 
npm install
```
### 3. Configure Environment Variables

``` 
PORT=5000
JWT_SECRET=your-secret-key
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PORT=your-database-port
DB_PASS=your-database-password
DB_NAME=your-database-name
```

### 4. Start the Server

``` 
npm run start
```
The server will start on http://localhost:5000.

## Once your app is started, manually connect to your database and input users data with fields "username" and "password" (hashed with bcrypt) or  continue with 5 - 8

### 5. Connect to database in your terminal
``` 
psql -U your_db_username -d your_database_name
```

### 6. Connect to Node.js REPL in a different terminal tab 
``` 
node
``` 

### 7. Once in Node.js REPL, Generate a hash password with Bcrypt
``` 
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10); // 10 salt rounds are standard
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}
```

### 8. Create a new user in the terminal where you initiated psql
```
INSERT INTO users (username, password_hash) VALUES ('your_username', 'your_bcrypt_hash');
```

Repeat this process for as much users as you wish. 

## 🔗 WebSocket Events

### 1. Connecting to WebSocket Server
```
const socket = io("http://localhost:5000"); 
```

### 2. Joining a Room

#### Request 
```
{
  "event": "joinRoom",
  "data": {
    "username": "John",
    "room": "General"
  }
}
```

#### Response 
```
{
  "event": "message",
  "data": "John joined the room"
}
```

### 3. Sending a Message

#### Request
```
{
  "event": "sendMessage",
  "data": {
    "sender": "John",
    "text": "Hello, everyone!",
    "timestamp": "2025-02-24T12:34:56Z"
  }
}
```

#### Response 
```
{
  "event": "message",
  "data": {
    "sender": "John",
    "text": "Hello, everyone!",
    "timestamp": "2025-02-24T12:34:56Z"
  }
}
```

### 4. Leaving a Room

#### Request
```
{
  "event": "leaveRoom",
  "data": {
    "username": "John",
    "room": "General"
  }
}
```

#### Response
```
{
  "event": "message",
  "data": "John left the room"
}
```

### 5. Disconnecting

#### Emit:
```
socket.disconnect();
```
