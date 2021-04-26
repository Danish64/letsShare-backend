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

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Sockets

const onConnection = (socket) => {
  console.log("User Connected to letsshare server", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  //All event handlers
  //eventHandler(io, socket);
};

io.on("connection", onConnection);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
