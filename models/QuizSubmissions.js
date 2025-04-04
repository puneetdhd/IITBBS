const mongoose = require('mongoose');

const QuizSubmissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      questionIndex: Number, // index of question in quiz.questions
      selectedOption: String,
      isCorrect: Boolean,
    }
  ],
  score: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('QuizSubmission', QuizSubmissionSchema);
