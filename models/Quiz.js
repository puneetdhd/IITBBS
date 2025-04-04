// models/Quiz.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ],
  QuizBy: String,
  deadline:Date
});

module.exports = mongoose.model('Quiz', QuizSchema);
