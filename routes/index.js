//importer express car il sera utilisé partout dans le projet
const express = require("express");
//for using bookSchema : reference the book model
const Book = require("../models/book");
//declarer la variable router à laquelle je passerais
const router = express.Router();
//les paramètres req et res + l'url
router.get("/", async (req, res) => {
  //create a book variable and default it to nothing
  let books;
  //check if the books exist first
  try {
    /*here we search for the books sorted by and limit
        it will search for all the 10 recent books by desc order */
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
  } catch {
    //en cas d'erreur vu qu'on est dans la premiere page, intialiser books to an empty array
    books = [];
  }
  //je mets le render ici cette fois car si je le mets dans le try il va me rendre tout les livres et meme ceux filtrés
  //Du coup
  res.render("index", { books: books });
});

//it serves to match the require and to give access for the imports (it maches the route var in server.js)
module.exports = router;
