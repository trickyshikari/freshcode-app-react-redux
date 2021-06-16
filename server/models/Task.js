const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

mongoose.model('Task', TaskSchema);
