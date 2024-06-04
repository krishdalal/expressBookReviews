const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TASK 6: Registering a new user
public_users.post("/register", (req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
          if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
          } else {
            return res.status(404).json({message: "User already exists!"});
          }
        }
        return res.status(404).json({message: "Unable to register user."});
    }
    catch(error){
        res.status(500).send("Error registering");
    }
});

// TASK 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    try{
        res.send(JSON.stringify(books, null, 3));
    }
    catch(error){
        res.status(500).send("Error getting book list");
    }
});

// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try{
        const isbn = req.params.isbn;
        let book = books[isbn];
    
        if(book){
            res.json(book);
        }
        else{
            res.status(404).send(`Unable to find book with ISBN: ${isbn}`);
        }
    }
    catch(error){
        res.status(500).send("Error getting book details based on ISBN");
    }
 });
  
// TASK 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try{
        const author = req.params.author;
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                let book = books[key];
                if(book.author==author){
                    res.send(book);
                }
            }
            res.status(404).send(`Unable to find book of author: ${author}`)
        }
    }
    catch(error){
        res.status(500).send("Error getting book details based on author");
    }
});

// TASK 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try{
        const title = req.params.title;
        for (let key in books) {
            if (books.hasOwnProperty(key)) {
                let book = books[key];
                if(book.title==title){
                    res.send(book);
                }
            }
            res.status(404).send(`Unable to find book with title: ${title}`)
        }
    }
    catch(error){
        res.status(500).send("Error getting book details based on title");
    }
});

//  TASK 5: Get book reviews
public_users.get('/review/:isbn',function (req, res) {
    try{
        const isbn = req.params.isbn;
        let book = books[isbn];
    
        if(book){
            res.send(book.reviews);
        }
        else{
            res.send(`Unable to find book with ISBN: ${isbn}`);
        }
    }
    catch(error){
        res.status(500).send("Error getting book reviews");
    }
});

module.exports.general = public_users;
