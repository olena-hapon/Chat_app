# Chat Application (Backend)

This is the backend of the chat application, built using Express.js and MongoDB. It handles the creation, updating, deletion of chats, as well as sending auto-responses using random quotes from the Zenquotes.io.

## Features Implemented

- **Create Chat**: Allows users to create a new chat with a first and last name.
- **Update Chat**: Updates the first and last name of an existing chat.
- **Delete Chat**: Deletes a chat and its associated messages with confirmation.
- **Send Auto-Response**: Automatically sends a response (random quote) to the user after sending a message.
- **Live Socket Communication**: Sends and receives live updates for new messages using Socket.IO.
- **Handle Messages**: Each chat stores a collection of messages, which are automatically updated when a new message is sent.
- **Backend Authentication**: Uses Clerk to authenticate users via Gmail.

## Technologies Used

- **Backend**: Express.js, MongoDB (Atlas), Socket.IO, Axios, Clerk (for authentication)
- **Database**: MongoDB for storing chat and message data
- **Authentication**: Clerk for Gmail login authentication
- **APIs**: Zenquotes.io for generating random quotes

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   npm run dev

The backend will be running at http://localhost:3000.

API Endpoints
POST /api/chats: Create a new chat.

GET /api/chats: Retrieve all chats for the authenticated user.

GET /api/chats/:id: Retrieve a specific chat and its messages.

POST /api/chats/:chatId/messages: Send a message to a chat and receive an auto-response.

PUT /api/chats/:id: Update the name of a chat.

DELETE /api/chats/:id: Delete a chat.

Live Demo
Link to the deployed backend


How it Works
The backend handles the creation of chats with the first and last names provided by the user.

When a user sends a message, the backend will automatically respond with a random quote after 3 seconds.

Live socket communication ensures real-time updates on messages and chat activities.

User authentication is managed through Clerk, allowing login via Gmail.

Chats and messages are stored in MongoDB, and the database is updated when new messages are sent or chats are created/updated/deleted.
