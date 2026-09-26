const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  gradeLevel: {
    type: Number,
    required: true,
    enum: [9, 10, 11, 12]
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
