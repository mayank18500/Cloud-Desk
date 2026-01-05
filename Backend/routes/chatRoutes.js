import express from 'express';
import Chat from '../model/chat.js';
import Interview from '../model/interview.js';

const router = express.Router();

// 1. Get All Chats for a User
router.get('/user/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId })
      .populate('participants', 'name avatar role')
      .populate('interviewId') // Get interview status
      .sort({ lastMessageAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// 2. Get Specific Chat Room
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name avatar role')
      .populate('interviewId');
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

// 3. Send Message
router.post('/:id/message', async (req, res) => {
  try {
    const { senderId, text } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    const newMessage = { sender: senderId, text, createdAt: new Date() };
    
    chat.messages.push(newMessage);
    chat.lastMessage = text;
    chat.lastMessageAt = new Date();
    
    await chat.save();
    
    // Return the populated message for instant UI update
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// 4. Start or Get Chat with a specific User (Fix for missing chats)
router.post('/start', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'name avatar role');

    if (chat) {
      return res.json(chat);
    }

    // If not, create it
    const newChat = new Chat({
      participants: [senderId, receiverId],
      messages: [],
      lastMessage: "Chat started",
      lastMessageAt: new Date()
    });

    await newChat.save();
    
    // Populate before returning
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants', 'name avatar role');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: 'Error starting chat' });
  }
});

// 5. Update Interview Schedule (Called from Chat UI)
router.put('/schedule/:interviewId', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    const interview = await Interview.findByIdAndUpdate(
      req.params.interviewId,
      { 
        date, 
        time, 
        status: 'scheduled' // Updates status to scheduled
      },
      { new: true }
    );

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling' });
  }
});

export default router;