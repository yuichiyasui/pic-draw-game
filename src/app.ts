import { createServer } from "node:http";
import path from "node:path";

import express from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import { Server } from "socket.io";

const app = express();

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

app.all("*", (_, res) => {
  const error = createHttpError(404);
  res
    .status(error.status)
    .sendFile(path.join(__dirname, "../public/not-found.html"));
});

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("chat1", (msg) => {
    io.emit("chat1", msg);
  });

  socket.on("chat2", (msg) => {
    io.emit("chat2", msg);
  });

  socket.on("nameEdit1", (name) => {
    io.emit("nameEdit1", name);
  });

  socket.on("nameEdit2", (name) => {
    io.emit("nameEdit2", name);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port} 🚀`);
});
