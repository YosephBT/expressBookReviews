const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", function (req, res) {
  return new Promise((resolve) => {
    resolve(books);
  })
    .then((data) => {
      if (data) res.send(JSON.stringify(data));
      res.send({ message: "There are no books available" });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return new Promise((resolve) => {
    resolve(book);
  })
    .then((data) => {
      if (data) res.send(JSON.stringify(data));
      res.send({
        message: "There is no book available with the isbn provided",
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const book = findBookByTitleAuthor(author);
  return new Promise((resolve) => {
    resolve(book);
  })
    .then((data) => {
      if (data) res.send(JSON.stringify(data));
      res.send({
        message: "There is no book available with the author name provided",
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const book = findBookByTitle(title);
  return new Promise((resolve) => {
    resolve(book);
  })
    .then((data) => {
      if (data) res.send(JSON.stringify(data));
      res.send({
        message: "There is no book available with the title provided",
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn].reviews;
  if (book) {
    return res.send(book);
  } else {
    return res.status(404).json({ message: "ISBN property doesn't exists!" });
  }
});

const findBookByTitle = (title) => {
  return Object.values(books).find((book) => book.title === title);
};
const findBookByTitleAuthor = (author) => {
  return Object.values(books).find((book) => book.author === author);
};

module.exports.general = public_users;
