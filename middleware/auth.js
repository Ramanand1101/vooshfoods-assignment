const jwt = require("jsonwebtoken");
require("dotenv").config();

let blacklistedTokens = []; // In-memory blacklist (use a database for persistence)

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from 'authorization' header

  if (!token) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Missing token",
      error: null,
    });
  }

  // Check if the token is blacklisted
  if (blacklistedTokens.includes(token)) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request: Token is invalidated",
      error: null,
    });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized: Invalid token",
          error: err.message,
        });
      }

      req.user = decoded; // Store decoded user info in the request
      next();
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const invalidateToken = (token) => {
  blacklistedTokens.push(token);
};

module.exports = { verifyToken, invalidateToken };
