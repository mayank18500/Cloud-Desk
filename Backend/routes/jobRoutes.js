import express from 'express';
import Job from '../model/Job.js';
import Interview from '../model/interview.js';
import Chat from '../model/chat.js';

const router = express.Router();

// ... (Keep existing Create/Get routes) ...
router.post('/', async (req, res) => {
    try {
        const { companyId, title, description, requirements, budget } = req.body;
        const newJob = new Job({ companyId, title, description, requirements, budget });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: 'Error posting job' });
    }
});

router.get('/', async (req, res) => {
    try {
      const jobs = await Job.find({ status: 'open' }).populate('companyId', 'name avatar');
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching jobs' });
    }
});
  
router.get('/company/:companyId', async (req, res) => {
    try {
      const jobs = await Job.find({ companyId: req.params.companyId })
        .populate('applicants.interviewerId', 'name title skills hourlyRate avatar');
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching company jobs' });
    }
});
  
router.post('/:id/apply', async (req, res) => {
    try {
      const { interviewerId } = req.body;
      const job = await Job.findById(req.params.id);
      
      const alreadyApplied = job.applicants.find(a => a.interviewerId.toString() === interviewerId);
      if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });
  
      job.applicants.push({ interviewerId });
      await job.save();
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error applying' });
    }
});

// Select Applicant Logic
router.put('/:id/select', async (req, res) => {
  try {
    const { interviewerId } = req.body;
    const job = await Job.findById(req.params.id);
    const applicant = job.applicants.find(a => a.interviewerId.toString() === interviewerId);
    
    if (applicant) {
        applicant.status = 'selected';
        await job.save();

        // 1. Create Interview Record
        const newInterview = new Interview({
            companyId: job.companyId,
            interviewerId: interviewerId,
            role: job.title, 
            candidateName: "Pending Assignment",
            date: "TBD",
            time: "TBD",
            status: "pending" // Changed to match enum usually used
        });
        await newInterview.save();

        // 2. Create Chat Room
        const newChat = new Chat({
            participants: [job.companyId, interviewerId],
            interviewId: newInterview._id,
            messages: [{
                sender: job.companyId,
                text: `SYSTEM: Job Offer for "${job.title}" has been sent.`,
                createdAt: new Date()
            }]
        });
        await newChat.save();
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error selecting applicant' });
  }
});

// NEW: Delete Job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job' });
    }
});

export default router;