const express = require("express");
const router = express.Router({ mergeParams: true });
const taskController = require("../controllers/taskController.js");

router.get("/", taskController.getTasksInProject);

router.post("/add-task", taskController.createTask);

router.get("/deadline-has-expired", taskController.deadlineHasExpired);

router.delete('/delete-task/:taskId', taskController.deleteTask);

router.patch('/status/:taskId', taskController.status);

router.patch('/update-task/:taskId', taskController.updateTask);

router.get("/:taskId", taskController.getTaskById);



module.exports = router;
