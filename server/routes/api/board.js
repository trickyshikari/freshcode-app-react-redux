const router = require("express").Router();
const mongoose = require("mongoose");
const Board = mongoose.model("Board");
const Queue = mongoose.model("Queue");
const Task = mongoose.model("Task");
const Comment = mongoose.model("Comment");
const Activity = mongoose.model("Activity");
const ActivityService = require("../../services/activity");
const auth = require("../auth");

router.get("/", auth.required, (req, res, next) => {
  Board.find()
    .then((boards) => {
      if (!boards) {
        return 0;
      } // todo 401

      res.json({
        success: true,
        boards: boards.map((b) => {
          return b.toShortJSON();
        }),
      });
    })
    .catch(next);
});

router.get("/:id", auth.required, (req, res, next) => {
  Board.findById(req.params.id)
    .populate({
      path: "queues",
      populate: {
        path: "tasks",
      },
    })
    .populate("activities")
    .then((board) => {
      if (!board) {
        return res.sendStatus(401);
      }

      res.json({
        success: true,
        board: board.toJSON(),
      });
    })
    .catch(next);
});

router.post("/", auth.required, async (req, res, next) => {
  const board = new Board();
  board.title = "Project ";
  await Board.countDocuments({}, function (err, count) {
    board.title += count + 1;
  });
  board.createdBy = req.payload.id;

  const queue = new Queue();
  queue.title = "Test";

  const task = new Task();
  task.title = "Task";
  task.description = "Let's start!";
  task.save();

  queue.tasks.push(task);
  queue.save();
  board.queues.push(queue);

  board
    .save()
    .then(() => {
      const activity = new ActivityService(
        board._id,
        "board",
        board.createdBy,
        {
          type: "create",
        }
      );

      activity.log().then(() => {
        res.json({
          success: true,
          id: board._id,
        });
      });
    })
    .catch(next);
});

router.put("/", auth.required, (req, res, next) => {
  const params = req.body;

  Board.findById(params.board.id)
    .populate({ path: "queues" })
    .then(async (board) => {
      if (!board) {
        return res.sendStatus(401);
      }

      if (typeof params.board.title !== "undefined") {
        board.title = req.body.board.title;
      }

      if (params.board.queue) {
        let queue = Queue.findById(params.board.queue.id);
        if (typeof queue.id === "undefined") {
          queue = new Queue();
        }

        if (typeof params.board.queue.title !== "undefined") {
          queue.title = params.board.queue.title;
        }

        queue.save();
        board.queues.push(queue);
      }

      board.save().then((board) => {
        res.json({
          board: board.toJSON(),
        });
      });
    })
    .catch(next);
});

router.delete("/queue", auth.required, (req, res, next) => {
  Board.findById(req.body.board.id)
    .populate("queues")
    .then((board) => {
      board.queues.pull(req.body.board.queue.id);
      Queue.findOneAndDelete(req.body.board.queue.id);

      board.save().then((board) => {
        res.json({
          board: board.toJSON(),
        });
      });
    })
    .catch(next);
});

router.delete("/", auth.required, (req, res, next) => {
  Board.findById(req.body.board.id)
    .then((board) => {
      return new Promise(async (resolve, reject) => {
        if (!board) {
        } // todo return error
        await Activity.find({ _id: { $in: board.activities } })
          .then((activities) => {
            activities.forEach((a) => {
              a.delete();
            });
          })
          .then(async () => {
            await Queue.find({ _id: { $in: board.queues } }).then((queues) => {
              queues.forEach(async (q) => {
                await Task.find({ _id: { $in: q.tasks } })
                  .then((tasks) => {
                    tasks.forEach(async (t) => {
                      await Comment.find({ _id: { $in: t.comments } })
                        .then((comments) => {
                          comments.forEach((c) => {
                            t.comments.pull(c.id);
                            c.delete();
                          });
                        })
                        .then(() => {
                          q.tasks.pull(t.id);
                          t.delete();
                        });
                    });
                  })
                  .then(() => {
                    board.queues.pull(q.id);
                    q.delete();
                  });
              });
            });
          });

        return resolve(board);
      });
    })
    .then((board) => {
      return board.delete();
    })
    .then((result) => {
      res.json({
        success: !!result,
      });
    })
    .catch(next);
});

module.exports = router;
