import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/* ---------------- REGISTER ---------------- */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['interviewer', 'company'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Flatten the profile object to match User Model
    // When using FormData, profile might come as a stringified JSON or separate fields
    let profileData = {};
    if (typeof profile === 'string') {
      try {
        profileData = JSON.parse(profile);
      } catch (e) {
        console.error('Failed to parse profile JSON', e);
      }
    } else {
      profileData = profile || {};
    }

    const { skills, hourlyRate, experience, cv, avatar, ...otherProfileData } = profileData;

    // Convert skills string to Array if needed
    let skillsArray = [];
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }

    // Handle files
    const cvPath = req.files?.cv?.[0]?.path;
    const avatarPath = req.files?.avatar?.[0]?.path;

    // Create user with FLAT structure
    const user = new User({
      name: role === 'company' ? (profileData.companyName || name) : name,
      email,
      password: hashedPassword,
      role,
      skills: skillsArray,
      hourlyRate: Number(hourlyRate) || 0,
      yearsExperience: Number(experience) || 0,
      website: otherProfileData.website,
      companyName: otherProfileData.companyName,
      location: otherProfileData.location,
      cv: cvPath,
      avatar: avatarPath,
      ...otherProfileData
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        hourlyRate: user.hourlyRate,
        cv: user.cv,
        avatar: user.avatar,
        portfolio: user.portfolio
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    console.log('Login Attempt for:', email);

    // Case-insensitive search
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      console.log('Login Failed: User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login Failed: Password mismatch for user:', user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return the Full User Object (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        ...userResponse // Send all flat fields (skills, hourlyRate, etc.)
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ---------------- DELETE ACCOUNT ---------------- */
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required for confirmation' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};