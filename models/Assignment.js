const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  dueDate: Date,
  fileUrl: { type: String, default: null },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
