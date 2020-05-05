//route for books
const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const Category = require("../models/category");
/*UploadImage.6 declare an uploadPath variable that will join between the public path and our created variable 
from the model and compose with it the realpath */
//const uploadPath = path.join('public', Book.coverImageBasePath)
// UploadImage.9 we need to specify here which types of images (an array) are to be accepted in order to pass them as the second parameter of the callback
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
//UploadImage.2 passing multer to a variable to be the setup for multer
//const upload = multer({
//UploadImage.7 here we pass the created path to be our destination path
//dest: uploadPath,
/* UploadImage.8 this is filtering which files to be accepted
    req is the request to the file
    callback is because we call an arrow function to see if its the types we accepted
    then result true or not the same */
//fileFilter: (req, file, callback) => {
/* null because we have no error
        callback(err, data)
        UploadImage.10 and add the file mimetype */
/*callback(null, imageMimeTypes.includes(file.mimetype))
    }*/
//})

/*All books route, i render the index of the autbooksors
Here specify the search options for the books search
After searching with a search param we should get the result 
inside books/index page*/
router.get("/", async (req, res) => {
  //try {
  /*declare a search query object with .find assigned to the schema (Book)
        always remember it will search on the model*/
  let query = Book.find({});
  //check if req.query is null and empty for the title
  if (req.query.title != null && req.query.title != "") {
    // if yes return the regular expression for the queried object title
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  //for the publishedBefore and publishedAfter features
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    //The lte means less than or equal from publishDate
    query = query.lte("publishDate", req.query.publishedBefore);
  }

  //Same thing for the publishedAfter date and thus we would have made the comparison
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  // here is to get all the books
  // we replace the .find by query.exec() to wait for the query to execute
  try {
    const books = await query.exec();
    res.render("books/index", {
      books: books,
      //we pass here the searchOptions as specified in the index.ejs
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

//New book route, this is displaying the creation form
router.get("/new", async (req, res) => {
  //call of the encaplusated function
  renderNewPage(res, new Book());
});

//this is for creating the books (Create Book route)
/* UploadImage.11 set route parameter to accept files
by adding first a parameter to specifiy that we will upload only a single file 
this library knows how to upload the file into the exact place*/
router.post("/", async (req, res) => {
  //UploadImage.12 then we test if file exists and get name out of it
  //const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  })
  //Here we call the save Cover function
  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch {
    //RemoveBookCover.2 : check if coverImage exists and call the remove function if it's the case
    /*if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }*/
    renderNewPage(res, book, true);
  }
})

//Show Book Route
router.get('/:id', async (req, res) => {
    try {
    const book = await Book.findById(req.params.id)
                 .populate('author')
                 .exec()
    res.render('books/show', { book : book })
    } catch {
        res.redirect('/');
    }
})

//Edit Book Route : This is to get the book by id
router.get("/:id/edit", async(req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book, true);
  } catch {
    res.redirect('/');
  }
})

//Put request to change a book
router.put('/:id', async(req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate) //parse the string to Date
    book.pageCount =  req.body.pageCount
    book.description = req.body.description
    if (req.body.cover != null && req.body.cover !== ''){
       saveCover(book, req.body.cover) // if book exists save the book 
    }
    await book.save()
    res.redirect(`/books/${book.id}`);
  } catch(err) {
    console.log(err)
    if(book != null){
      renderEditPage(res, book, true)
    } else {
      res.redirect('/')
    }
  }
  })

//RemoveBookCover.3 : here i specify the function to remove unwanted book covers
/*function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath,fileName), err => {
        if(err) console.error(err)
    })
}*/
//Here the code for the delete button
router.delete('/:id', async(req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    //check if a book exist but we can't delete it
    if(book != null) {
      res.render('books/show', {
        //pass params
        book: book,
        errorMessage: 'Could not remove book'
      })
      //not able to find a book
    } else {
      res.redirect('/')
    }
  }
})
//SaveBook1 : a function to encapsulate all the logic for the create new book
async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError)
}

//Function to render the Edit Page which is like the render New Page
async function renderEditPage(res, book, hasError = false) {
 renderFormPage(res, book, 'edit', hasError)
}

//Factorize the render new page and the render edit page into 
async function renderFormPage(res, book, form, hasError =
false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    }
    /*if(hasError) {
      if(form === 'edit') {
        params.errorMessage = 'Error Updating Book';
      } else {
        params.errorMessage = 'Error Creating Book';
      }
    }*/
    res.render(`books/${form}`, params); // here we pass the form that will either be changed to edit or new
  } catch {
    res.redirect('/books');
  }
}

//This is the function that will help save the parsed cover
function saveCover(book, coverEncoded) {
  //First if the coverEncoded doesn't exist return nothing
  if (coverEncoded == null) return;
  //Else parse and decode pass it to a variable called cover
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    //Here we create a Buffer from the data , since FilePond receives buffers (takes the image converts to base 64 and gets the JSON)
    //The base 64 is how we want to convert it from
    book.coverImage = new Buffer.from(cover.data, "base64");
    //Here we extract the cover type and convert it to an image of the selected type
    book.coverImageType = cover.type;
  }
}

module.exports = router;
