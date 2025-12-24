import express from 'express';
import User from '../model/User.js';

const router = express.Router();

// Update User Profile
router.put('/:id', async (req, res) => {
  try {
    const { name, title, bio, skills, hourlyRate, yearsExperience } = req.body;
    
    // Find and update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { name, title, bio, skills, hourlyRate, yearsExperience } 
      },
      { new: true } // Return the updated document
    ).select('-password'); // Exclude password from result

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get User Profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;