const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProject = asyncHandler(async (req, res) => {
  const { title, users } = req.body;
  const adminIds = [];
  adminIds.push(req.user.id);
  const project = await prisma.project.create({
    data: {
      title,
      admin: {
        connect: adminIds.map((adminId) => ({ id: adminId })),
      },
      users: {
        connect: users.map((userId) => ({ id: userId })), // Add users
      },
    },
    include: {
      admin: true,
      users: true,
    },
  });

  res.json(project);
});

exports.addAdminsForProject = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.projectId);
  const adminIds = req.body.adminIds;
  if (!Array.isArray(adminIds) || adminIds.some((id) => isNaN(id))) {
    return res.status(400).json({ error: "Invalid admin IDs" });
  }
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      admin: true,
    },
  });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const currentUserId = req.user.id;
  const checkCurrentUserIsAdmin = project.admin.some(
    (admin) => admin.id === currentUserId
  );

  if (!checkCurrentUserIsAdmin) {
    return res
      .status(403)
      .json({ error: "You must be an admin to modify project admins" });
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      admin: {
        connect: adminIds.map((adminId) => ({ id: adminId })),
      },
    },
    include: {
      admin: true,
    },
  });
  res.json(updatedProject);
});

exports.addUsersForProject = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.projectId);
  const userIds = req.body.userIds;
  if (!Array.isArray(userIds) || userIds.some((id) => isNaN(id))) {
    return res.status(400).json({ error: "Invalid User IDs" });
  }
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      admin: true,
    },
  });
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const currentUserId = req.user.id;
  const checkCurrentUserIsAdmin = project.admin.some(
    (admin) => admin.id === currentUserId
  );

  if (!checkCurrentUserIsAdmin) {
    return res
      .status(403)
      .json({ error: "You must be an admin to modify project admins" });
  }
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      users: {
        connect: userIds.map((UserId) => ({ id: UserId })),
      },
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.json(updatedProject);
});

exports.getAll = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user from authentication middleware

  // Fetch all projects where the user is either an admin or a member
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
          admin: {
            some: {
              id: userId, // User is an admin
            },
          },
        },
        {
          users: {
            some: {
              id: userId, // User is a member
            },
          },
        },
      ],
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
        },
      },
      users: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json(projects);
});
