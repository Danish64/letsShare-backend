const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: "https://letusshare.herokuapp.com/",
    methods: ["GET", "POST"],
  },
};
const io = require("socket.io")(httpServer, options);
//Sockets
global.socketId = "";
const onConnection = (socket) => {
  socketId = socket.id;
  console.log("User Connected to letsshare server", socketId);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  //All event handlers
  //eventHandler(io, socket);
};

io.on("connection", onConnection);
require("./startup/routes")(app, io);
require("./startup/db")();
require("./startup/prod")(app);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
