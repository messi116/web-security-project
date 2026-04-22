const express = require('express');
const app = express();

app.use(express.json());

const validator = require('validator');

app.post('/signup', (req, res) => {
    const { email, password, name } = req.body;

    // Email validation
    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    // Password length check
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).send('Password too short');
    }

    // XSS prevent
    const safeName = validator.escape(name);

    // Final response (IMPORTANT)
    res.send({
        message: "User registered safely",
        name: safeName
    });
});

// Server start (VERY IMPORTANT)
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
