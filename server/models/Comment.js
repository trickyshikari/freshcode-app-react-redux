const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Comment', CommentSchema);
