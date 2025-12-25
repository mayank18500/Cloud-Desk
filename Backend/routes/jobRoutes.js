import express from 'express';
import Job from '../model/Job.js';
import Interview from '../model/interview.js';
import Chat from '../model/chat.js';

const router = express.Router();

// ... (Keep existing Create/Get routes) ...
router.post('/', async (req, res) => {
    // ... (Same as before)
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

// === UPDATED SELECTION LOGIC ===
router.put('/:id/select', async (req, res) => {
  try {
    const { interviewerId } = req.body;
    const job = await Job.findById(req.params.id);
    const applicant = job.applicants.find(a => a.interviewerId.toString() === interviewerId);
    
    if (applicant) {
        applicant.status = 'selected';
        await job.save();

        // 1. Create Interview Record (Status: pending_schedule)
        const newInterview = new Interview({
            companyId: job.companyId,
            interviewerId: interviewerId,
            role: job.title, // Use Job Title as role
            candidateName: "Pending Assignment", // Or generic placeholder
            date: "TBD",
            time: "TBD",
            status: "pending_schedule" // Special status
        });
        await newInterview.save();

        // 2. Create Chat Room
        const newChat = new Chat({
            participants: [job.companyId, interviewerId],
            interviewId: newInterview._id,
            messages: [{
                // System message
                text: `Welcome! This chat is connected to the job "${job.title}". Please discuss and schedule the interview.`
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

export default router;