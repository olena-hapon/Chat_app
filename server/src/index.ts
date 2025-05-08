import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import fetch from 'node-fetch';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { Chat, ChatDocument } from "./models/chat.js";
// @ts-ignore
import Message from "./models/message.js";
import axios from "axios";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cors({
  origin:"http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const users = new Map();

const MONGO_URI = process.env.MONGODB_URI || "";

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

server.listen(port, () => {
  connect();
  console.log("server is running on 3000");
});

app.get("/api/check", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/auto-send", async (req: Request, res: Response) => {
  try {
    const chats: ChatDocument[] = await Chat.find().exec();
    if (chats.length === 0) return res.status(400).send("No chats found");

    let content: string;

    try {
      const quoteRes = await axios.get("https://zenquotes.io/api/random");
      const quoteData = quoteRes.data;

      if (Array.isArray(quoteData) && quoteData[0]?.q && quoteData[0]?.a) {
        content = `${quoteData[0].q} — ${quoteData[0].a}`;
      } else {
        console.warn(" Невалідна структура");
        content = "Бот не зміг отримати цитату";
      }
    } catch (err) {
      console.error("Помилка при отриманні цитати:", err);
      content = "Бот не зміг отримати цитату.";
    }

    const randomChat = chats[Math.floor(Math.random() * chats.length)];

    if (!randomChat || !randomChat._id || !randomChat.participant) {
      return res.status(400).send("Invalid chat selected");
    }

    const newMessage = new Message({
      chatId: randomChat._id,
      sender: "bot",
      text: content,
    });

    await newMessage.save();

    await Chat.findByIdAndUpdate(randomChat._id, {
      $push: { messages: newMessage._id }
    });
    console.log(newMessage)

    io.emit("newMessage", {
      chatId: String(randomChat._id),
      chatName: `${randomChat.participant.firstName} ${randomChat.participant.lastName}`,
      message: newMessage.text,
    });

    res.status(200).send("Message sent");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;

    const chats = await Chat.find({ userId })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {

    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {

  try {
    const userId = req.auth.userId;
    const chats = await Chat.findOne({ _id: req.params.id, userId })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
      })

    if (!chats) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chats);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { firstName, lastName } = req.body;

    const newChat = new Chat({
      userId,
      participant: { firstName, lastName },
      messages: [],
    });

    await newChat.save();

    setTimeout(async () => {

      try {
        const quoteRes = await axios.get('https://zenquotes.io/api/random');
        const data = quoteRes.data[0];
        const botMessage = new Message({
          chatId: newChat._id,
          sender: 'bot',
          text: `${data.q} — ${data.a}`,
        });

        await botMessage.save();
        console.log(botMessage)

        await Chat.findByIdAndUpdate(newChat._id, {
          $push: { messages: botMessage._id }
        });

      } catch (error) {
        console.log('Bot response failed', error);
      }
    }, 3000);

    res.status(201).json(newChat);

  } catch (err) {
    console.error('Create chat error:', err);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

app.post('/api/chats/:chatId/messages', ClerkExpressRequireAuth(), async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;

  try {
    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const userMessage = new Message({
      chatId,
      sender: 'user',
      text,
    });

    await userMessage.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: userMessage._id },
    });

    setTimeout(async () => {
      try {
        let quote = '';
        
        try {
          const quoteRes = await axios.get('https://zenquotes.io/api/random');
          const quoteData = quoteRes.data;

          if (Array.isArray(quoteData) && quoteData[0]?.q && quoteData[0]?.a) {
            quote = `${quoteData[0].q} — ${quoteData[0].a}`;
          } else {
            console.warn( quoteData);
          }
        } catch (err) {
          console.error('Помилка при отриманні цитати:', err);
        }

        const botMessage = new Message({
          chatId,
          sender: 'bot',
          text: quote,
        });

        await botMessage.save();

        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: botMessage._id },
        });

      } catch (err) {
        console.error('Bot reply failed:', err);
      }
    }, 3000);

    res.status(201).json(userMessage);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});


app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId },
      { participant: {firstName, lastName} },
      { new: true }
    );

    console.log(chat)

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const chat = await Chat.findOneAndDelete({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await Message.deleteMany({ chatId: chat._id });

    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


app.use((req, res, next) => {
  console.log('Authorization Header:', req.headers.authorization); 
  next();
});
