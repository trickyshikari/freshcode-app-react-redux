const router = require('express').Router();
const mongoose = require('mongoose');
const Queue = mongoose.model('Queue');
const Board = mongoose.model('Board');
const ActivityService = require('../../services/activity');

router.get('/:boardId', (req, res, next) => {
  Board.findById(req.params.boardId)
    .populate({
      path: 'queues',
      populate: {
        path: 'tasks'
      }
    })
    .then((board) => {
      if (!board) {
        return 0;
      } // todo 401

      res.json({
        queues: board.queues
      });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const queue = new Queue();
  queue.title = req.body.queue.title;

  Board.findById(req.body.board.id)
    .then((board) => {
      if (!board) {
      } // TODO return 401
      queue.save();
      board.queues.push(queue);

      board.save().then(() => {
        const activity = new ActivityService(
          queue._id,
          'queue',
          board.createdBy,
          {
            type: 'create'
          }
        );

        activity.log().then(() => {
          res.json({
            success: true,
            queue: queue.toJSON()
          });
        });
      });
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  Queue.findById(req.body.queue._id)
    .populate('tasks')
    .then((queue) => {
      if (!queue) {
        return 0;
      } // todo 401

      if (typeof req.body.queue.title !== 'undefined') {
        queue.title = req.body.queue.title;
        const activity = new ActivityService(
          queue._id,
          'queue',
          queue.createdBy, // TODO change to current user
          {
            type: 'update'
          }
        );
        activity.log();
      }
      queue.save().then((queue) => {
        res.json({
          success: true,
          queue: queue.populate('tasks')
        });
      });
    })
    .catch(next);
});

router.delete('/', (req, res, next) => {
  Board.findOne({ queues: req.body.queue._id })
    .then((board) => {
      if (!board) {
        return 0;
      } // TODO return 401

      board.queues.pull({ _id: req.body.queue._id });
      board.save();

      const activity = new ActivityService(
        req.body.queue.id,
        'queue',
        '60b5112e26cad05568339c57', //queue.createdBy, // TODO change to current user
        {
          type: 'delete'
        }
      );

      activity.log().then(() => {
        res.json({
          success: !!Queue.findById(req.body.queue.id).then((queue) => {
            if (!queue) {
            } // todo return error
            return queue.delete();
          })
        });
      });
    })
    .catch(next);
});

module.exports = router;
