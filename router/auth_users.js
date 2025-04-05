const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let user=req.session.authorization['username'];
    let review = req.body.review;
    const hadReview = user in books[isbn].reviews;

    if (books[isbn]) {
        books[isbn].reviews[user] = review;
        if(hadReview)
            res.send(`Review with the isbn ${isbn} updated.`);
        res.send(`Review with the isbn ${isbn} inserted.`);
    } else {
        res.send("Unable to find a book!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let user=req.session.authorization['username'];
    const hadReview = user in books[isbn].reviews;
    if (books[isbn]) {
        if(hadReview)
            delete books[isbn].reviews[user];
            res.send(`Review with the isbn ${isbn} deleted.`);
        res.send(`you don't have any review.`);
    } else {
        res.send("Unable to find a book!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
