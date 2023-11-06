require("dotenv").config();
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid token",
          status: "Failed",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      message: "No token provided",
      status: "Failed",
    });
  }
};

module.exports = verifyToken;
