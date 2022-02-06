import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { validateAnswerMessage, validateCallUserMessage } from "./validators";

const PORT = process.env.PORT || "3000";
/**
 * key: userId,
 * value: userName
 */
const roster: { [key: string]: string } = {};
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
  console.log("socket.io connected:", socket.id);
  // send user id to client first
  // console.log("sending user id:", socket.id);
  socket.emit("me", socket.id);

  // debuggingg purpose
  socket.onAny((event) => {
    console.log("event:", { event });
  });

  // disconnect handler
  socket.on("disconnect", () => {
    console.log(`${roster[socket.id]} is disconnected`);
    socket.broadcast.emit("callended");
    delete roster[socket.id];
    console.log("roster", roster);
    io.emit("rosterUpdate", roster);
  });

  // when user sets username, add it to roster and advertise it all users
  socket.on("newUser", (username: string) => {
    roster[socket.id] = username;
    console.log("roster update:", roster);
    io.emit("rosterUpdate", roster);
  });

  // this will send 'callUser' message to callee
  socket.on("callUser", (message: any) => {
    console.log("socket.on(callUser)");
    try {
      const callUserMessage = validateCallUserMessage(message);
      console.log(JSON.stringify(callUserMessage));
      socket.to(callUserMessage.callee.id).emit("callUser", callUserMessage);
    } catch (e) {
      // send error message back to sender
      socket.emit(`server erorr: ${e}`);
    }
  });

  // this gets kicked off when callee send answer
  socket.on("answerCall", (message: any) => {
    try {
      const answer = validateAnswerMessage(message);
      socket.to(answer.caller.id).emit("callAccepted", answer);
    } catch (e) {
      // send error message back to sender
      socket.emit(`server erorr: ${e}`);
    }
  });

  // cancel call
  socket.on("callRefected", (message) => {
    const callUserMessage = validateCallUserMessage(message);
    socket.to(callUserMessage.caller.id).emit("callRejected", callUserMessage);
  });
});

server.listen(PORT, () => console.log(`✨ Listening on port ${PORT} ✨`));
