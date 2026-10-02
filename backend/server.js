const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    regNo: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
});



const User = mongoose.model("User", userSchema);



app.post("/signup", async (req, res) => {

    try {

        const { name, regNo, password } = req.body;

        // Check if all fields are filled
        if (!name || !regNo || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ regNo });

        if (existingUser) {
            return res.status(400).json({
                message: "Registration number already exists"
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            name: name,
            regNo: regNo,
            password: hashedPassword
        });

        
        await newUser.save();

        res.status(201).json({
            message: "Sign-up successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



app.listen(5001, () => {
    console.log("Server running on http://localhost:5001");
});