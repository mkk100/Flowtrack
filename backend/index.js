const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
  next();
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  console.log(users);
  console.log('GET /users');
  res.json(users);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});