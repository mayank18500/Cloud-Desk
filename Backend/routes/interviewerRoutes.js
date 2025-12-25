import express from 'express';
import User from '../model/User.js';
import { editInterviewer, updateInterviewer } from '../controllers/interviewerController.js';

const router = express.Router();

// 1. GET all interviewers (Fix: Uncommented this section)
router.get('/', async (req, res) => {
  try {
    // Fetch all users who have the role 'interviewer'
    const interviewers = await User.find({ role: 'interviewer' }).select('-password');
    res.json(interviewers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Edit routes
router
  .route("/edit/:id")
  .get(editInterviewer)
  .put(updateInterviewer);

export default router;