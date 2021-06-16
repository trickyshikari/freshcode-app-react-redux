const mongoose = require('mongoose');
const User = mongoose.model('User');
const Board = mongoose.model('Board');
const Queue = mongoose.model('Queue');
const Task = mongoose.model('Task');
const Activity = mongoose.model('Activity');

class ActivityService {
  constructor(id, object, createdBy, action, ref = null) {
    this.id = id;
    this.object = object;
    this.createdBy = createdBy;
    this.action = action;
    this.ref = null;

    this.actions = {
      create: 'created',
      update: 'edited',
      delete: 'removed'
    };
  }

  log() {
    return this.formQuery().then((query) => {
      Board.findOne(query)
        .then((board) => {
          if (!board) {
            return 0;
          }
          const activity = new Activity();
          activity.createdBy = this.createdBy;
          activity.object = this.object;
          activity.ref = this.ref;

          let title = '';

          const user = User.findById(this.createdBy);

          title += user.email;
          title += ' ' + this.actions[this.action.type];
          title += ' ' + this.object + (this.action.attr ? "'s" : '');

          if (this.action.attr) {
            title += ' ' + this.action.attr;
          }

          title += ' at ' + new Date().toLocaleDateString('en-US');
          activity.action = title;
          activity.save();

          board.activities.push(activity);
          return board;
        })
        .then((board) => {
          board.save();
        });
    });
  }

  formQuery() {
    return new Promise(async (resolve, reject) => {
      let query = {};
      let _id = this.id;

      switch (this.object) {
        case 'board':
          query._id = _id;
          break;
        case 'comment':
          await Task.findOne({
            comments: _id
          }).then((comment) => {
            _id = comment._id;
          });
        case 'task':
          await Queue.findOne({
            tasks: _id
          }).then((queue) => {
            _id = queue._id;
          });
        case 'queue':
          query.queues = _id;
          break;
      }
      return resolve(query);
    });
  }
}

module.exports = ActivityService;
