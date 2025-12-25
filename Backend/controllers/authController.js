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

    // 1. FIX: Flatten the profile object to match User Model
    // Extract specific fields from the profile object sent by frontend
    const { skills, hourlyRate, experience, ...otherProfileData } = profile || {};

    // 2. FIX: Convert skills string to Array if needed
    let skillsArray = [];
    if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    } else if (Array.isArray(skills)) {
        skillsArray = skills;
    }

    // Create user with FLAT structure
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      // Map frontend 'profile' fields to User Model root fields
      skills: skillsArray,
      hourlyRate: Number(hourlyRate) || 0,
      yearsExperience: Number(experience) || 0,
      ...otherProfileData // spreads title, bio, etc.
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
        title: user.title
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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