import express from 'express';
import Interviewer from '../model/interviewer.js';

const router = express.Router();

// GET all interviewers
router.get('/', async (req, res) => {
  try {
    const interviewers = await Interviewer.find({});
    res.json(interviewers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST a new interviewer (Use this to seed data initially)
router.post('/', async (req, res) => {
  try {
    const newInterviewer = new Interviewer(req.body);
    const savedInterviewer = await newInterviewer.save();
    res.status(201).json(savedInterviewer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating interviewer', error: error.message });
  }
});

export default router;