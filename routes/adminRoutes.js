// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const Course = require('../models/Course');

router.use(auth, roleCheck('admin'));


router.post('/create-user', async (req, res) => {
    try {
      const { name, email, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });
  
      const plainPassword = crypto.randomBytes(6).toString('hex'); // e.g., 'd9a0e3b8c2d1'
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
      const newUser = new User({
        name,
        email,
        role,
        password: hashedPassword
      });
  
      await newUser.save();
  
      const emailText = `
  Hi ${name},
  
  Your account has been created on the College E-Learning Platform.
  
  Login Email: ${email}
  Temporary Password: ${plainPassword}
  
  Please login and change your password after first login.
  
  Regards,
  Admin Team`;
  
      await sendEmail(email, 'Your Account Credentials - E-Learning Platform', emailText);
  
      res.status(201).json({
        message: 'User created and credentials sent to email.',
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  router.post('/create-course', async (req, res) => {
    try {
      const { title, description, faculty } = req.body;
  
      if (!title || !description || !faculty) {
        return res.status(400).json({ error: "All fields (title, description, faculty) are required." });
      }
  
      const course = new Course({ title, description, faculty });
      await course.save();
  
      res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
      console.error("Error creating course:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

router.post('/submit-quiz/:quizId', async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers } = req.body; // answers = [{ questionIndex: 0, selectedOption: 'A' }, ...]
  
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
  
      // Check deadline
      if (quiz.deadline && new Date() > quiz.deadline) {
        return res.status(400).json({ error: 'Deadline has passed for this quiz' });
      }
  
      // Auto-grade
      let score = 0;
      const gradedAnswers = answers.map((answer) => {
        const question = quiz.questions[answer.questionIndex];
        const isCorrect = question.correctAnswer === answer.selectedOption;
        if (isCorrect) score += 1;
        return {
          ...answer,
          isCorrect,
        };
      });
  
      // Save submission
      const submission = new QuizSubmission({
        quiz: quizId,
        student: req.user.id, // assuming auth middleware adds this
        answers: gradedAnswers,
        score,
      });
  
      await submission.save();
  
      res.status(201).json({ message: 'Quiz submitted successfully', submission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  


module.exports = router;
