const router = require('express').Router();
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Comment = mongoose.model('Comment');
const ActivityService = require('../../services/activity');

router.get('/:taskId', (req, res, next) => {
  Task.findById(req.params.taskId)
    .then((task) => {
      if (!task) {
      } // todo 401

      Comment.find({
        _id: { $in: task.comments }
      }).then((comments) => {
        if (!comment) {
          return 0;
        } // todo 401

        res.json({
          comments: comments.toJSON()
        });
      });
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  Task.findById(req.body.task.id)
    .then((task) => {
      if (!task) {
      } // todo 401

      const comment = new Comment();
      comment.createdBy = '60b5112e26cad05568339c57'; // TEMP userID
      comment.description = req.body.comment.description;

      task.comments.push(comment);
      task.save();

      comment.save().then((comment) => {
        console.log(comment);
        const activity = new ActivityService(
          comment._id,
          'comment',
          comment.createdBy,
          {
            type: 'create'
          }
        );

        activity.log().then(() => {
          res.json({
            success: true,
            task: task.toJSON()
          });
        });

        res.json({
          success: true,
          comments: comment.toJSON()
        });
      });
    })
    .catch(next);
});

module.exports = router;
