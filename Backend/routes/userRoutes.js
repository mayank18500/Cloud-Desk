import express from 'express';
import User from '../model/User.js';
import { uploadMixed } from '../middleware/multer.js';
import { deleteAccount } from '../controllers/authController.js';

const router = express.Router();

router.delete('/:id', deleteAccount);

router.put('/:id', uploadMixed.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Profile update request for ID:', req.params.id);
    const { name, title, bio, skills, hourlyRate, yearsExperience, portfolio } = req.body;

    const updateData = {
      name,
      title,
      bio,
      hourlyRate: Number(hourlyRate) || 0,
      yearsExperience: Number(yearsExperience) || 0,
      portfolio
    };

    if (skills) {
      try {
        updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        console.error('Error parsing skills:', e);
        // Fallback to splitting if it's a comma-separated string, though frontend sends JSON
        if (typeof skills === 'string' && skills.includes(',')) {
          updateData.skills = skills.split(',').map(s => s.trim());
        }
      }
    }

    if (req.files) {
      if (req.files.cv) {
        console.log('New CV uploaded:', req.files.cv[0].path);
        updateData.cv = req.files.cv[0].path;
      }
      if (req.files.avatar) {
        console.log('New avatar uploaded:', req.files.avatar[0].path);
        updateData.avatar = req.files.avatar[0].path;
      }
    }

    console.log('Updating user with data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      console.log('User not found for update:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Map _id to id for frontend compatibility
    const userObj = updatedUser.toObject();
    userObj.id = userObj._id;

    console.log('Profile updated successfully for:', userObj.email);
    res.json(userObj);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;