// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const cloudinary = require('cloudinary').v2;
router.use(auth, roleCheck('student'));

// Ensure Cloudinary is configured
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

router.get('/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

router.post('/enroll/:courseId', async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  course.students.push(req.user.id);
  await course.save();
  res.json({ msg: 'Enrolled successfully' });
});


router.post('/submit-assignment', async (req, res) => {
    try {
      const { assignment, content } = req.body;
  
      // Check for file
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'File is required' });
      }
  
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(
        req.files.file.tempFilePath,
        { folder: 'submissions' }
      );
  
      // Create new submission
      const submission = new Submission({
        assignment,
        content,
        student: req.user.id,
        fileUrl: result.secure_url,
      });
  
      await submission.save();
      res.status(201).json(submission);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
