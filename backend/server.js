const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err));


// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    regNo: String,
    password: String
});

const User = mongoose.model("User", userSchema);


// =======================
// SIGN UP
// =======================

app.post("/signup", async (req, res) => {

    try {

        const { name, regNo, password } = req.body;

        // Check whether user already exists
        const existingUser = await User.findOne({ regNo });

        if (existingUser) {
            return res.status(400).json({
                message: "Registration number already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name: name,
            regNo: regNo,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =======================
// LOGIN
// =======================

app.post("/login", async (req, res) => {

    try {

        const { regNo, password } = req.body;

        // Find user using registration number
        const user = await User.findOne({ regNo });

        if (!user) {
            return res.status(401).json({
                message: "Invalid registration number or password"
            });
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid registration number or password"
            });
        }

        // Login successful
        res.json({
            message: "Login successful",
            name: user.name
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Start server
app.listen(5001, () => {
    console.log("Server running on http://localhost:5001");
});