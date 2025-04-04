// routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');

router.use(auth, roleCheck('faculty'));

router.post('/course', async (req, res) => {
  const { title, description } = req.body;
  const course = new Course({ title, description, faculty: req.user.id });
  await course.save();
  res.json(course);
});


router.post('/assignment', async (req, res) => {
    try {
      const { course, title, description, dueDate } = req.body;
  
      // Basic validation
      if (!course || !title || !dueDate) {
        return res.status(400).json({ error: 'Course, title, and due date are required' });
      }
  
      let fileUrl = null;
  
      // If a file is provided, upload it to Cloudinary
      if (req.files && req.files.file) {
        const result = await cloudinary.uploader.upload(
          req.files.file.tempFilePath,
          { folder: 'assignments' }
        );
        fileUrl = result.secure_url;
      }
  
      const assignment = new Assignment({
        course,
        title,
        description,
        dueDate,
        fileUrl // will be null if no file uploaded
      });
  
      await assignment.save();
      res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


router.post('/quiz', async (req, res) => {
    try {
      const { course, questions, QuizBy, deadline } = req.body;
  
      // Basic validation
      if (!course || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Course and questions are required' });
      }
  
      const quiz = new Quiz({
        course,
        questions,
        QuizBy,
        deadline,
      });
  
      await quiz.save();
      res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;