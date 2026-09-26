const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
