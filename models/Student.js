const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  image: {
    type: String,
    default: ""
  },
  frequentVisits: [{
    itemType: { type: String, enum: ['Subject', 'Chapter'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'frequentVisits.itemType' },
    count: { type: Number, default: 1 },
    lastVisited: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
module.exports = mongoose.model('Student', studentSchema);
