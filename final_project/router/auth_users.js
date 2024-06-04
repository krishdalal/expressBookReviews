const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//Check if the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//Code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//TASK 7: only registered users can login
regd_users.post("/login", (req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(404).json({message: "Error logging in"});
        }
        if (authenticatedUser(username,password)) {
          let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
        } 
        else {
          return res.status(208).json({message: "Invalid Login. Check username and password"});
        }
    }
    catch(error){
        res.status(500).send("Error logging in");
    }
});

// TASK 8: Add/Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try{
        const isbn = req.params.isbn;
        const username = req.session.authorization.username;
        const review = req.query.review;
        let book = books[isbn];
    
        if(!username){
            res.send("Please login with valid username")
        }
        if(!review){
            res.send("Please give a review")
        }
    
        if(book){
            book.reviews[username] = review;
            res.send(`Succesfully added review for book with ISBN: ${isbn}`)
        }
        else{
            res.send(`Unable to find book with ISBN: ${isbn}`);
        }
    }
    catch(error){
        res.status(500).send("Error adding book review");
    }
});

// TASK 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    try{
        const isbn = req.params.isbn;
        const username = req.session.authorization.username;
        let book = books[isbn];
    
        if(!username){
            res.send("Please login with valid username")
        }
        if(book){
            let review = book.reviews[username];
            delete book.reviews[username];
            if(review){
                res.send(`Successfully deleted your review for book with ISBN: ${isbn}`)
            }
            else{
                res.send(`No review found to delete for book with ISBN: ${isbn}`)
            }
        }
        else{
            res.send(`Unable to find book with ISBN: ${isbn}`);
        }
    }
    catch(error){
        res.status(500).send("Error deleting review");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
