const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline } = req.body;
  const projectId = parseInt(req.params.projectId);
  const adminId = parseInt(req.user.id);
  const userId = parseInt(req.body.userId);
  const status = "PENDING";

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
  if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status value. Must be PENDING, IN_PROGRESS, or COMPLETED.",
    });
  }
  const task = await prisma.task.update({
    where: { id },
    data: {
      status,
    },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });

  return res.json(task);
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
      OR: [
        {
          userId: userId, // User is an admin
        },
        {
          adminId: userId, // User is a member
        },
      ],
    },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
    },
  });

  return res.json(tasks);
});
