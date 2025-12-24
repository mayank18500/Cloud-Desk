import express from 'express';
import Company from '../model/company.js';

const router = express.Router();

// GET all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: 'Error creating interviewer', error: error.message });
  }
});

export default router;