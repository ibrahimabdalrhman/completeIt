const express = require("express");
const router = express.Router(0);
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const taskRoute = require("./taskRoute");

router.use(authMiddleware);

router.use("/:projectId/tasks", taskRoute);

router.get("/", projectController.getAll);
router.get("/:projectId", projectController.getProjectById);
router.post("/new-project", projectController.createProject);
router.patch("/:projectId/add-admin", projectController.addAdminsForProject);
router.patch("/:projectId/add-user", projectController.addUsersForProject);
router.get("/:projectId/all-admins", projectController.getAllAdminsinProject);
router.get("/:projectId/all-users", projectController.getAllUserinProject);

module.exports = router;
