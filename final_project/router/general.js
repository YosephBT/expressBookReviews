const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book=findBookByTitleIsbn(isbn);
    if (book) {
        return     res.send(book);
    } else {
        return res.status(404).json({message: "ISBN property doesn't exists!"});
    }
    res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book=findBookByTitleAuthor(author);
    res.send(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book=findBookByTitle(title);
    res.send(book);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

const findBookByTitle = (title) => {
    return Object.values(books).find(book => book.title === title);
};
const findBookByTitleAuthor = (author) => {
    return Object.values(books).find(book => book.author === author);
};
const findBookByTitleIsbn = (isbn) => {
    return Object.values(books).find(book => book.isbn === isbn);
};


module.exports.general = public_users;
