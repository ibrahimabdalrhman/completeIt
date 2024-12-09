// Import dependencies
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const createNotification = require("../utils/notification");
const prisma = new PrismaClient();

// Helper functions
const validateStatus = (status) => {
  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  return validStatuses.includes(status);
};

// Task Controllers
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline } = req.body;
  const projectId = parseInt(req.params.projectId);
  const adminId = parseInt(req.user.id);
  const userId = parseInt(req.body.userId);

  const io = req.app.get("io");

  const task = await prisma.task.create({
    data: {
      title,
      deadline,
      description,
      userId,
      adminId,
      projectId,
    },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });

  await createNotification(
    userId,
    `You have been assigned a new task: ${title}`,
    `/api/project/${projectId}/tasks/${task.id}`,
    io
  );
  return res.json(task);
});

exports.getTasksInProject = asyncHandler(async (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });
  return res.json(tasks);
});

exports.getTaskById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.taskId);
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });
  return res.json(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.taskId);
  const task = await prisma.task.delete({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });
  return res.json(task);
});

exports.status = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.taskId);
  const status = req.body.status;

  if (!validateStatus(status)) {
    return res.status(400).json({
      error:
        "Invalid status value. Must be PENDING, IN_PROGRESS, or COMPLETED.",
    });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { status },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });
  return res.json(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.taskId);
  const { title, description, status, deadline, userId } = req.body;
  const adminId = parseInt(req.user.id);

  const task = await prisma.task.findUnique({
    where: { id },
    include: { createdBy: true },
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  if (task.adminId !== adminId) {
    return res.status(403).json({ error: "Unauthorized to update this task." });
  }

  const updateData = {
    title: title || task.title,
    description: description || task.description,
    status: status || task.status,
    deadline: deadline || task.deadline,
  };

  if (userId) {
    updateData.assignedTo = {
      connect: { id: parseInt(userId) },
    };
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: updateData,
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });

  return res.status(200).json({
    message: "Task updated successfully.",
    task: updatedTask,
  });
});

exports.deadlineHasExpired = asyncHandler(async (req, res) => {
  const now = new Date();
  const projectId = parseInt(req.params.projectId);
  const userId = req.user.id;

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      deadline: {
        lte: now,
      },
      OR: [{ userId: userId }, { adminId: userId }],
    },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });
  return res.json(tasks);
});
