import express from 'express';
import Interview from '../model/interview.js';
import User from '../model/User.js';

const router = express.Router();

// Create new interview request (Booking)
router.post('/', async (req, res) => {
  try {
    const { companyId, interviewerId, candidateName, role, date, time, notes } = req.body;
    const newInterview = new Interview({
      companyId,
      interviewerId,
      candidateName,
      role,
      date,
      time,
      notes
    });
    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
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
      .populate('companyId', 'name avatar')
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