import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Chat from './src/models/Chat.js';
import Message from './src/models/Message.js';

dotenv.config();

const seedChats = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const clerkUserId = process.env.SEED_USER_ID;
  if (!clerkUserId) {
    console.error('user not find');
    process.exit(1);
  }

  const existing = await Chat.find({ userId: clerkUserId });
  if (existing.length === 0) {
    const chats = await Chat.insertMany([
      {
        userId: clerkUserId,
        participant: { firstName: 'Alice', lastName: 'Smith' },
        messages: [],
      },
      {
        userId: clerkUserId,
        participant: { firstName: 'Bob', lastName: 'Johnson' },
        messages: [],
      },
      {
        userId: clerkUserId,
        participant: { firstName: 'Charlie', lastName: 'Brown' },
        messages: [],
      },
    ]);

    for (const chat of chats) {
      const messages = await Message.insertMany([
        {
          chatId: chat._id,
          sender: 'user',
          text: `Hi ${chat.participant.firstName}!`,
        },
        {
          chatId: chat._id,
          sender: 'bot',
          text: `Hello ${chat.participant.firstName}, how can I assist you today?`,
        },
      ]);

      chat.messages = messages.map((msg) => msg._id);
      await chat.save();
    }

    console.log('Seeded chats and messages');
  } else {
    console.log('Chats already exist');
  }

  process.exit();
};

seedChats();
