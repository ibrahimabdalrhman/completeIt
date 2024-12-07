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
