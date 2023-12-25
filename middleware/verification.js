require("dotenv").config();
const { SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");

function verification(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    console.log(authHeader);
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid Token !!!",
        });
      }
      req.data = data;
      next();
    });
  } else {
    return res.status(403).json({
      message: "Invalid or Expired Token !!!",
    });
  }
}

module.exports = verification;
