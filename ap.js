const express = require("express");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(helmet());

// Dummy user
const user = {
  _id: "12345",
  email: "test@example.com",
  password: "123456"
};

// 🔥 OPTIONAL: browser warning route (fixes "Cannot GET /login")
app.get("/login", (req, res) => {
  res.send("⚠️ Use POST method for login, not browser GET request");
});

// LOGIN ROUTE (POST)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// PROTECTED ROUTE
app.get("/profile", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const verified = jwt.verify(token, "your-secret-key");
    res.json({
      message: "Protected data access granted",
      user: verified
    });
  } catch (err) {
    res.status(400).send("Invalid token");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
