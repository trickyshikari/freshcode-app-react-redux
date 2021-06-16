const mongoose = require('mongoose');
const User = mongoose.model('User');

const ActivitySchema = new mongoose.Schema(
  {
    action: String,
    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

mongoose.model('Activity', ActivitySchema);
