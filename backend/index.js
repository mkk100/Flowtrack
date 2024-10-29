const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type", "Authorization");
  next();
});
app.get("/test", (req, res) => {
  res.json("test ok");
});
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: "can't find the data" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch {
    res.status(400).json({ error: "can't find the data" });
  }
});
app.post("/users", async (req, res) => {
  console.log(req.body.id);
  try {
    const user = await prisma.user.create({
      data: {
        id: req.body.id.toString(),
        username: req.body.username,
        avatar: req.body.avatar,
        followers: [],
        following: [],
        posts: [],
        logs: [],
      },
    });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: "can't save the data" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: id.toString() },
      data: {
        username: req.body.username,
        avatar: req.body.avatar,
      },
    });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: "can't update the data" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
