var express = require('express');
var router = express.Router();
const userData = require('../db/UsersDB');
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');
const fs = require("fs");


// for user to get all files name from the remote directory '/uploads'
router.get('/files', function (req, res, next) {

    try {
        const directory = "uploads/";

        let filenames = fs.readdirSync(directory);

        console.log(filenames)

        res.status(200).json({
            "message": "Success get all files from remote directory.",
            "files": filenames
        })

    } catch (err) {
        res.status(401).json({ "error": err.message })
    }

});

// for user to login 
router.post('/login', (req, res, next) => {
    const body = req.body;
    const dbData = userData;

    if (!body.username || !body.password) {
        res.status(400).json({ "error": "Missing username or password." })
        return
    }

    const user = dbData.find(user => {
        return user.username == body.username
    })

    if (!user) {
        res.status(400).json({ "error": "User does not exist." })
        return
    }

    const hashedPassword = cryptoJS.SHA256(body.password).toString();

    if (user.password !== hashedPassword) {
        console.log(user.password, hashedPassword)
        res.status(400).json({ "error": "Wrong password." })
        return
    }

    const clonedUser = { ...user };

    // remove password and generate json web token
    delete clonedUser.password

    const token = jwt.sign({ user: clonedUser  }, 'SECRET_KEY', { expiresIn: '1800s' });

    res.status(200).json({ token });

})


// for register new account
router.post('/register', (req, res) => {
    const body = req.body;

    if (!body.username || !body.password) {
        res.status(400).json({ "error": "Missing username or password." })
        return
    }

    console.log(userData)

    const user = userData.find(user => {
        console.log(user.username, body.username)
        return user.username == body.username
    })

    console.log(user)

    if (user != null) {
        res.status(400).json({ "error": "User already exist. Please login." })
        return
    }

    // perform hashing for the password
    const hashedPassword = cryptoJS.SHA256(body.password).toString();

    const newUser = {
        id: userData.length + 1,
        username: body.username,
        password: hashedPassword
    }

    userData.push(newUser);

    // clone the user and remove password
    const clonedUser = { ...newUser };

    delete clonedUser.password

    // generate json web token
    const token = jwt.sign({ user: clonedUser }, 'SECRET_KEY', { expiresIn: '1800s' });

    res.status(200).json({ token });

})

module.exports = router;
