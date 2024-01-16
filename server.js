const express = require("express");
const userRoute = require("./src/routes/userRoute.js");
const chatRoute = require("./src/routes/chatRoute.js");
const bodyParser = require("body-parser");
const passport = require('passport');
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const { createMessage } = require("./src/Controller/chatController.js");

const app = express();
const {mongoConnection}=require('./src/database.js')
const {initializingPassport}=require('./src/passport.js')
const PORT = +process.env.PORT || 3000;
mongoConnection()
initializingPassport(passport)

const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN ?? "*",
  })
);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN ?? "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);
  await socket.on("newMessage", (data) => {
    const { toUserId } = data;
    createMessage(data);
    socket.to(toUserId).emit("newMessage", data);
  });
});



app.use("/api", userRoute);
app.use("/api", chatRoute);


server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
