import express from 'express';
import User from '../model/User.js';

const router = express.Router();

router.put('/:id', async (req, res) => {
  try {
    const { name, title, bio, skills, hourlyRate, yearsExperience } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        // Updates the flat properties directly
        $set: { name, title, bio, skills, hourlyRate, yearsExperience } 
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});
// ... GET route ...
export default router;