import express from 'express';
import Interview from '../model/interview.js';
import Chat from '../model/chat.js';
import User from '../model/User.js';
import { uploadCV } from '../middleware/multer.js';

const router = express.Router();

// Create new interview request (Booking)
router.post('/', uploadCV.single('cv'), async (req, res) => {
  try {
    const { companyId, interviewerId, candidateName, role, date, time, description } = req.body;
    const cvUrl = req.file ? req.file.path : null;


    const newInterview = new Interview({
      companyId,
      interviewerId,
      candidateName,
      role,
      date,
      time,
      description,
      cv: cvUrl
    });
    await newInterview.save();

    // Automatically create a Chat room
    const initialMessage = `Hi, I have sent a request for the ${role} position for candidate ${candidateName}.`;
    const newChat = new Chat({
      participants: [companyId, interviewerId],
      interviewId: newInterview._id,
      messages: [{
        sender: companyId,
        text: initialMessage,
        createdAt: new Date()
      }],
      lastMessage: initialMessage,
      lastMessageAt: new Date()
    });
    await newChat.save();

    res.status(201).json(newInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating interview', error: error.message });
  }
});

// Get interviews for a specific user (Interviewer or Company)
router.get('/user/:userId', async (req, res) => {
  try {
    const { type } = req.query; // 'company' or 'interviewer'
    const query = type === 'company'
      ? { companyId: req.params.userId }
      : { interviewerId: req.params.userId };

    const interviews = await Interview.find(query)
      .populate('companyId', 'name avatar website')
      .populate('interviewerId', 'name avatar')
      .sort({ date: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews' });
  }
});

// Update interview status (Accept, Decline, Complete)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

export default router;