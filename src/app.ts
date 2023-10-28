import { createServer } from "node:http";
import path from "node:path";

import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import createError from "http-errors";
import logger from "morgan";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// catch 404 and forward to error handler
app.use(function (_, __, next) {
  next(createError(404));
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};

app.use(errorHandler);

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

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
