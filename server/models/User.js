const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Prevents two people from using the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['student', 'mentor'], // Restricts roles to these two options
    default: 'student'
  }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('User', userSchema);