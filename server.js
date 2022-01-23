const express = require("express");
const useSocket = require("socket.io");

const app = express();
const server = require("http").Server(app);
const io = useSocket(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./build"));

const PORT = process.env.PORT || 3001;

const rooms = new Map();

/*
 ЗАПРОСЫ
*/
app.get("/rooms/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages")],
      }
    : { users: [], messages: [] };
  res.json(roomInfo);
});

app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  } else {
    if ([...rooms.get(roomId).get("users").values()].includes(userName)) {
      res.status(401);
    }
  }

  res.send();
});

/*
 СОКЕТ
*/
io.on("connection", (socket) => {
  socket.on("ROOM.JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.to(roomId).emit("ROOM.SET_USERS", users);
  });

  socket.on("ROOM.NEW_MESSAGE", ({ roomId, author, text }) => {
    const message = { author, text };
    rooms.get(roomId).get("messages").push(message);
    socket.to(roomId).emit("ROOM.ADD_MESSAGE", message);
  });

  socket.on("disconnect", () => {
    console.log("disconnecting");
    rooms.forEach((room, roomId) => {
      if (room.get("users").delete(socket.id)) {
        const users = [...room.get("users").values()];
        socket.to(roomId).emit("ROOM.SET_USERS", users);
      }
    });
  });

  console.log("user connected", socket.id);
});

server.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  }
  console.log("Server starts!");
});
