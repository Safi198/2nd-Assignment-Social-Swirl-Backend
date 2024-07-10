const express = require("express");
const mongoose = require("mongoose");
const db = require("./database");
const userDb = require("./model");

const app = express();
const port = 3000;

app.use(express.json());

// Check server running
app.get("/", (req, res) => {
    res.send("Server is running fine");
});

// Get all users from db
app.get("/users", async (req, res) => {
    try {
        const users = await userDb.find();
        res.status(200).json(users);
    } catch (err) {
        console.log("Error fetching users: ", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Create new user in db
app.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new userDb({ name, email, password });
        await newUser.save();
        res.status(201).json({ success: "New User Added", user: newUser });
    } catch (err) {
        console.log("Error creating user: ", err);
        if (err.name === "ValidationError") {
            res.status(400).json({ error: err.message });
        } else if (err.code === 11000) {
            res.status(409).json({ error: "Email already exists" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Get user from db by id
app.get("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: 'User found', user });
    } catch (err) {
        console.log('Error fetching user by id:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user data by id
app.put("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const updatedUser = await userDb.findByIdAndUpdate(
            userId,
            { name, email, password },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: 'User Updated', user: updatedUser });
    } catch (err) {
        console.log('Error updating user:', err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else if (err.code === 11000) {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

// Delete user by id
app.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const deletedUser = await userDb.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).json({ success: 'User deleted' });
    } catch (err) {
        console.log(`Error deleting user: ${err}`);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
