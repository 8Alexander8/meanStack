const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("access denied");

  try {
    jwt.verify(token, config.get("jwtKey"));
    next();
  } catch (err) {
    console.log("Invalid Token")
    return status(400).send("Invalid Token");
  }
};
