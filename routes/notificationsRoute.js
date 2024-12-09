const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.user.id);
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  })
);
router.patch(
  "/:notificationId",
  asyncHandler(async (req, res) => {
    const notificationId = parseInt(req.params.notificationId);
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return res.json(notification);
  })
);

module.exports = router;
