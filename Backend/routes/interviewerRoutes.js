import express from 'express';
import User from '../model/User.js';
import { editInterviewer, updateInterviewer } from '../controllers/interviewerController.js';
import { uploadMixed } from '../middleware/multer.js';

const router = express.Router();

// 1. GET all interviewers
router.get('/', async (req, res) => {
  try {
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
  .put(uploadMixed.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]), updateInterviewer);

export default router;