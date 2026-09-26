const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'Short', 'Long'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String
  },
  imageUrl: {
    type: String,
    default: null
  },
  answerImageUrl: {
    type: String,
    default: null
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
