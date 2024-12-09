// Import dependencies
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize app and dependencies
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);


// Middleware
app.use(cors());
app.use(express.json());




// Routes
const userRoute = require("./routes/userRoute");
const projectRoute = require("./routes/projectRoute");
const notificationsRoute = require("./routes/notificationsRoute");

app.use("/api/user", userRoute);
app.use("/api/project", projectRoute);
app.use("/api/notifications", notificationsRoute);

io.on("connection", (socket) => {
    console.log("A user connected to Socket.IO");
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
