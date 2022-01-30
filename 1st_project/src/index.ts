import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { validateAnswerData, validateCallUserData } from "./validators";

const PORT = process.env.PORT || "3000";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

/**
 * controllers for HTTP sesrver
 */
app.get("/", (req, res) => {
  res.status(200).send({ result: "hello world" });
});

/**
 * controllers for Socket.io
 */
io.on("connection", (socket) => {
  // send user id to client first
  socket.emit("me", socket.id);

  // disconnect handler
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  // custom hander "calluser"
  socket.on("calluser", (callUserData: any) => {
    const { userToCall, signalData, from, name } =
      validateCallUserData(callUserData);
    socket.to(userToCall).emit("answer", { signal: signalData, from, name });
  });

  // this gets kicked off when callee send answer
  socket.on("answer", (answerData: any) => {
    const { to, signal } = validateAnswerData(answerData);
    socket.to(to).emit("callaccepted", signal);
  });
});

app.listen(PORT, () => console.log(`✨ Listening on port ${PORT} ✨`));
