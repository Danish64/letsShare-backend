const debug = require("debug")("app:db");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
