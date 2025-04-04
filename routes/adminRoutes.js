// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const Course = require('../models/Course');

router.use(auth, roleCheck('admin'));

router.post('/create-user', async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  await user.save();
  res.json(user);
});

router.post('/create-course', async (req, res) => {
  const { title, description, faculty } = req.body;
  const course = new Course({ title, description, faculty });
  await course.save();
  res.json(course);
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
