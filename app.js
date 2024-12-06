const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const userRoute=require('./routes/userRoute')
app.use('/api/user',userRoute);



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server Running in port ${port}`));
