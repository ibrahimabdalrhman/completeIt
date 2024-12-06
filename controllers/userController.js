const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createUser = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  res.status(201).json({
    message: "user created successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(404).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EX,
    }
  );
  res.status(201).json({
    token,
  });
});
