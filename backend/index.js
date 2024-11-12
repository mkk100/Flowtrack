const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");
const app = express();
app.use(cors());

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
  const { id, username, avatar } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: id.toString() },
    });

    if (existingUser) {
      return res.status(200).json("already exists");
    }

    const user = await prisma.user.create({
      data: {
        id: id.toString(),
        username: username,
        avatar: avatar,
      },
    });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: "can't save the data for account " });
  }
});
app.post("/posts", async (req, res) => {
  const { userId, description, level, duration } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        description: description.toString(),
        deepWorkLevel: parseInt(level),
        deepWorkDuration: parseInt(duration),
        userId: userId.toString(),
      },
    });
    res.status(200).json(post);
  } catch {
    res.status(400).json({ error: "can't save the post data" });
  }
});
app.post("/deepWorkLogs", async (req, res) => {
  console.log(req.body);
  const { userId, description, minutesLogged, deepWorkLevel } = req.body;
  try {
    const deepWorkLog = await prisma.deepWorkLog.create({
      data: {
        userId: userId.toString(),
        description: description,
        minutesLogged: parseInt(minutesLogged),
        deepWorkLevel: parseInt(deepWorkLevel),
      },
    });
    res.status(200).json(deepWorkLog);
  } catch {
    res.status(400).json({ error: "can't save the deep work log data" });
  }
});
app.get("/users/:username/deepWorkLogs", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deepWorkLogs = await prisma.deepWorkLog.findMany({
      where: { userId: user.id.toString() },
    });

    res.status(200).json(deepWorkLogs);
  } catch {
    res.status(400).json({ error: "can't retrieve the deep work logs" });
  }
});
app.post("/groups", async (req, res) => {
  const { groupName, groupDescription, user } = req.body;
  try {
    const group = await prisma.group.create({
      data: {
        name: groupName,
        description: groupDescription,
      },
    });
    const userRecord = await prisma.user.findUnique({
      where: { username: user },
    });

    if (!userRecord) {
      return res.status(400).json({ error: "User not found" });
    }

    const groupMember = await prisma.groupMembership.create({
      data: {
        groupId: group.id,
        userId: userRecord.id,
      },
    });

    res.status(200).json({ group, groupMember });
  } catch {
    res.status(400).json({ error: "can't save the group data" });
  }
});
app.post("/groups/:groupId/memberships", async (req, res) => {
  const { groupId } = req.params;
  const { userName } = req.body;
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId.toString() },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const user = await prisma.user.findUnique({
      where: { username: userName },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const membership = await prisma.groupMembership.create({
      data: {
        groupId: groupId.toString(),
        userId: user.id.toString(),
      },
    });

    res.status(200).json(membership);
  } catch {
    res.status(400).json({ error: "can't add the membership" });
  }
});

app.get("/users/:username/groups", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const memberships = await prisma.groupMembership.findMany({
      where: { userId: user.id.toString() },
      include: {
        group: {
          select: {
            name: true,
            description: true,
            _count: {
              select: { memberships: true },
            },
          },
        },
      },
    });

    res.status(200).json(memberships);
  } catch {
    res
      .status(400)
      .json({ error: "can't retrieve the groups and memberships" });
  }
});
app.get("/users/:username/available-groups", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroups = await prisma.groupMembership.findMany({
      where: { userId: user.id.toString() },
      select: { groupId: true },
    });

    const userGroupIds = userGroups.map((membership) => membership.groupId);

    const availableGroups = await prisma.group.findMany({
      where: {
        id: {
          notIn: userGroupIds,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: { memberships: true },
        },
      },
    });

    res.status(200).json(availableGroups);
  } catch {
    res.status(400).json({ error: "can't retrieve available groups" });
  }
});
app.get("/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId.toString() },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ error: "Group not found" });
    }
  } catch {
    res.status(400).json({ error: "can't retrieve the group" });
  }
});
app.get("/addAdmin", async (req, res) => {
  const { user } = req.body;
});
app.post("/users/follow", async (req, res) => {
  const { id, followingId } = req.body;
  try {
    const user = await prisma.follow.create({
      data: {
        followerId: id.toString(),
        followingId: followingId.toString(),
      },
    });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: "can't save the data for follow" });
  }
});

app.get("/deepWorkLogs/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId.toString() },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const stats = await Promise.all(
      group.memberships.map(async (membership) => {
        const logs = await prisma.deepWorkLog.findMany({
          where: {
            userId: membership.userId.toString(),
            logDate: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        });

        const totalMinutes = logs.reduce(
          (acc, log) => acc + log.minutesLogged,
          0
        );
        const averageLevel =
          logs.length > 0
            ? logs.reduce((acc, log) => acc + log.deepWorkLevel, 0) /
              logs.length
            : 0;

        return {
          username: membership.user.username,
          totalMinutes: totalMinutes,
          averageDeepWorkLevel: averageLevel,
        };
      })
    );

    res.status(200).json(stats);
  } catch {
    res.status(400).json({ error: "can't retrieve the deep work stats" });
  }
});

app.delete("/users/unfollow", async (req, res) => {
  const { id, followingId } = req.body;
  try {
    const follow = await prisma.follow.deleteMany({
      where: {
        followerId: id.toString(),
        followingId: followingId.toString(),
      },
    });
    res.status(200).json(follow);
  } catch {
    res.status(400).json({ error: "can't delete the follow data" });
  }
});
app.get("/users/followed/:user/:guest", async (req, res) => {
  try {
    const follow = await prisma.follow
      .findFirst({
        where: {
          follower: {
            username: req.params.user,
          },
          following: {
            username: req.params.guest,
          },
        },
      })
      .then((data) => {
        if (data) {
          res.status(200).json({ isFollowing: true });
        } else {
          res.status(200).json({ isFollowing: false });
        }
      });
  } catch {
    res.status(400).json({ error: "can't check the follow status" });
  }
});
app.get("/users/followers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const followersCount = await prisma.follow.count({
      where: { followingId: id.toString() },
    });
    res.status(200).json({ followers: followersCount });
  } catch {
    res.status(400).json({ error: "can't retrieve followers count" });
  }
});
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    res.status(200).json(posts);
  } catch {
    res.status(400).json({ error: "can't retrieve the posts" });
  }
});
app.get("/users/following/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const followingsCount = await prisma.follow.count({
      where: { followerId: id.toString() },
    });
    res.status(200).json({ followings: followingsCount });
  } catch {
    res.status(400).json({ error: "can't retrieve followings count" });
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
