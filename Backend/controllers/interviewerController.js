import User from '../model/User.js';

export const editInterviewer = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

export const updateInterviewer = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        title: req.body.title,
        bio: req.body.bio,
        skills: req.body.skills,
        yearsExperience: req.body.yearsExperience,
        hourlyRate: req.body.hourlyRate,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
