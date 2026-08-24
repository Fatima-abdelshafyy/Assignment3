const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const FILE = path.join(__dirname, "users.json");


// Allow Express to read JSON request bodies
app.use(express.json());


// ========================================
// Helper Function: Read Users
// ========================================

function readUsers() {

    const data = fs.readFileSync(FILE, "utf8");

    return JSON.parse(data || "{}");
}


// ========================================
// Helper Function: Write Users
// ========================================

function writeUsers(users) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(users, null, 4)
    );
}


// ========================================
// 1. POST /user
// Add a new user
// ========================================

app.post("/user", (req, res) => {

    const users = readUsers();

    const { name, age, email } = req.body;


    // Check required data

    if (!name || age === undefined || !email) {

        return res.status(400).json({
            message: "Name, age and email are required."
        });

    }


    // Check if email already exists

    for (const id in users) {

        if (users[id].email === email) {

            return res.status(409).json({
                message: "Email already exists."
            });

        }

    }


    // Generate new ID

    const ids = Object.keys(users);

    let newId = 1;

    if (ids.length > 0) {

        newId = Math.max(...ids.map(Number)) + 1;

    }


    // Create user

    users[newId] = {

        id: newId,

        name: name,

        age: parseInt(age),

        email: email

    };


    // Save to JSON file

    writeUsers(users);


    res.status(201).json({

        message: "User added successfully.",

        user: users[newId]

    });

});


// ========================================
// 2. PATCH /user/:id
// Update user
// ========================================

app.patch("/user/:id", (req, res) => {

    const users = readUsers();

    const id = parseInt(req.params.id);


    // Check if user exists

    if (!users[id]) {

        return res.status(404).json({
            message: "User not found."
        });

    }


    const { name, age, email } = req.body;


    // Check email duplication

    if (email !== undefined) {

        for (const userId in users) {

            if (
                parseInt(userId) !== id &&
                users[userId].email === email
            ) {

                return res.status(409).json({
                    message: "Email already exists."
                });

            }

        }

    }


    // Update only provided fields

    if (name !== undefined) {

        users[id].name = name;

    }

    if (age !== undefined) {

        users[id].age = parseInt(age);

    }

    if (email !== undefined) {

        users[id].email = email;

    }


    // Save changes

    writeUsers(users);


    res.status(200).json({

        message: "User updated successfully.",

        user: users[id]

    });

});


// ========================================
// 3. DELETE /user/:id
// Delete user
// ========================================

app.delete("/user/:id", (req, res) => {

    const users = readUsers();

    const id = parseInt(req.params.id);


    // Check if user exists

    if (!users[id]) {

        return res.status(404).json({
            message: "User not found."
        });

    }


    // Save deleted user before deleting

    const deletedUser = users[id];


    // Delete user

    delete users[id];


    // Update JSON file

    writeUsers(users);


    res.status(200).json({

        message: "User deleted successfully.",

        user: deletedUser

    });

});


// ========================================
// 4. GET /user/getByName
// Get user by name
// ========================================

app.get("/user/getByName", (req, res) => {

    const users = readUsers();

    const name = req.query.name;


    if (!name) {

        return res.status(400).json({
            message: "Name query parameter is required."
        });

    }


    for (const id in users) {

        if (
            users[id].name.toLowerCase() ===
            name.toLowerCase()
        ) {

            return res.status(200).json(users[id]);

        }

    }


    res.status(404).json({
        message: "User not found."
    });

});


// ========================================
// 5. GET /user
// Get all users
// ========================================

app.get("/user", (req, res) => {

    const users = readUsers();

    res.status(200).json(users);

});


// ========================================
// 6. GET /user/filter
// Filter users by minimum age
// ========================================

app.get("/user/filter", (req, res) => {

    const users = readUsers();

    const minAge = parseInt(req.query.minAge);


    if (isNaN(minAge)) {

        return res.status(400).json({
            message: "minAge must be a valid number."
        });

    }


    const filteredUsers = {};


    for (const id in users) {

        if (users[id].age >= minAge) {

            filteredUsers[id] = users[id];

        }

    }


    res.status(200).json(filteredUsers);

});


// ========================================
// 7. GET /user/:id
// Get user by ID
// ========================================

app.get("/user/:id", (req, res) => {

    const users = readUsers();

    const id = parseInt(req.params.id);


    if (!users[id]) {

        return res.status(404).json({
            message: "User not found."
        });

    }


    res.status(200).json(users[id]);

});


// Start Server

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});