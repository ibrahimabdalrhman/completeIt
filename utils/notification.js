const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNotification = async (userId, content, uri,io) => {
    
  await prisma.notification.create({
    data: {
      userId,
      content,
      uri,
    },
  });

  io.to(userId.toString()).emit("newNotification", {
    content,
    uri,
    createdAt: new Date(),
  });

};

module.exports = createNotification;
