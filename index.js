const debug = require("debug")("app:db");
const express = require("express");
const app = express();
const path = require("path");

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
