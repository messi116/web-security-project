const express = require("express");
const helmet = require("helmet");

const app = express();

// Apply Helmet middleware
app.use(helmet());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Secure App with Helmet");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
