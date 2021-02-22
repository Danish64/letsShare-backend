const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // console.log("Auth Middleware Called!!");
  //Get the token
  const token = req.header("x-auth-token");
  //Return if not exist with 401 error
  if (!token) return res.status(401).send("Access denied. No token provided");
  //Verify the token
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
  //return user if verified and call next
  //return exception
};
