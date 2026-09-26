const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Punjab', 'Federal'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
