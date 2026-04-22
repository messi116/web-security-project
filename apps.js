const express = require('express');
const app = express();

app.use(express.json());

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Temporary DB (memory)
let users = [];

// SIGNUP
app.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email');
    }

    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).send('Password too short');
    }

    const safeName = validator.escape(name);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email,
        password: hashedPassword,
        name: safeName
    });

    res.send("User registered securely");
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Wrong password");

    // JWT token
    const token = jwt.sign(
        { email: user.email },
        "secretkey",
        { expiresIn: "1h" }
    );

    res.send({ message: "Login successful", token });
});

// PROTECTED ROUTE
function auth(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) return res.sendStatus(401);
        req.user = decoded;
        next();
    });
}

app.get('/profile', auth, (req, res) => {
    res.send("Protected Profile Data");
});

// SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
