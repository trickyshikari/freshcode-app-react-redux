const router = require('express').Router();
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Queue = mongoose.model('Queue');
const ActivityService = require('../../services/activity');

router.get('/:id', (req, res, next) => {
  Task.findById(req.params.id)
    .populate('comments')
    .then((task) => {
      if (!task) {
      } // todo return error

      Activity.find({ ref: task.id }).then((activity) => {
        res.json({
          success: true,
          task: task.toJSON(),
          activity: activity
        });
      });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const task = new Task();
  task.title = req.body.task.title;
  task.description = req.body.task.description;
  task.createdBy = '60b5112e26cad05568339c57';
  task.save();

  Queue.findById(req.body.queue.id)
    .then((queue) => {
      if (!queue) {
        return 0;
      } // todo 401
      queue.tasks.push(task);
      queue.save().then(() => {
        const activity = new ActivityService(task._id, 'task', task.createdBy, {
          type: 'create'
        });

        activity.log().then(() => {
          res.json({
            success: true,
            task: task.toJSON()
          });
        });
      });
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  Task.findById(req.body.task.id)
    .then((task) => {
      if (!task) {
        return 0;
      } // TODO 401

      if (typeof req.body.task.title !== 'undefined') {
        task.title = req.body.task.title;

        const activity = new ActivityService(
          task._id,
          'task',
          task.createdBy, // TODO change to current user
          {
            type: 'update',
            attr: 'title'
          }
        );
        activity.log();
      }

      if (typeof req.body.task.description !== 'undefined') {
        task.description = req.body.task.description;

        const activity = new ActivityService(
          task._id,
          'task',
          task.createdBy, // TODO change to current user
          {
            type: 'update',
            attr: 'description'
          }
        );
        activity.log();
      }
      task.save().then(() => {
        res.json({
          success: true,
          task: task
        });
      });
    })
    .catch(next);
});

router.delete('/', (req, res, next) => {
  Queue.findOne({ tasks: req.body.task.id })
    .then((queue) => {
      if (!queue) {
        return 0;
      } // todo return 401
      queue.tasks.pull({ _id: req.body.task.id });
      queue.save();

      const activity = new ActivityService(
        req.body.task.id,
        'task',
        '60b5112e26cad05568339c57', //queue.createdBy, // TODO change to current user
        {
          type: 'delete'
        }
      );

      activity.log().then(() => {
        res.json({
          success: !!Task.findById(req.body.task.id).then((task) => {
            if (!task) {
            } // todo return error
            return task.delete();
          })
        });
      });
    })
    .catch(next);
});

module.exports = router;
