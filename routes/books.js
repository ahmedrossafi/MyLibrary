//route for books
const express = require('express')
const router = express.Router()
//UploadImage.1 requiring multer
const multer = require('multer')
//UploadImage.5 import path library
const path = require('path')
//RemoveBookCover.1 : import the fs lib to use it in unlink
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
/*UploadImage.6 declare an uploadPath variable that will join between the public path and our created variable 
from the model and compose with it the realpath */
const uploadPath = path.join('public', Book.coverImageBasePath)
// UploadImage.9 we need to specify here which types of images (an array) are to be accepted in order to pass them as the second parameter of the callback
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
//UploadImage.2 passing multer to a variable to be the setup for multer
const upload = multer({
    //UploadImage.7 here we pass the created path to be our destination path
    dest: uploadPath,
   /* UploadImage.8 this is filtering which files to be accepted
    req is the request to the file
    callback is because we call an arrow function to see if its the types we accepted
    then result true or not the same */
    fileFilter: (req, file, callback) => {
        /* null because we have no error
        callback(err, data)
        UploadImage.10 and add the file mimetype */
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

/*All books route, i render the index of the autbooksors
Here specify the search options for the books search
After searching with a search param we should get the result 
inside books/index page*/
router.get('/', async (req, res) => {
    try {
        /*declare a search query object with .find assigned to the schema (Book)
        always remember it will search on the model*/
        let query = Book.find({})
        //check if req.query is null and empty for the title
        if(req.query.title != null && req.query.title != '') {
            // if yes return the regular expression for the queried object title
            query = query.regex('title', new RegExp(req.query.title, 'i'))
        }
        //for the publishedBefore and publishedAfter features
        if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
            //The lte means less than or equal from publishDate
            query = query.lte('publishDate', req.query.publishedBefore)
        }

        //Same thing for the publishedAfter date and thus we would have made the comparison
        if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
            query = query.gte('publishDate', req.query.publishedAfter)
        }
        // here is to get all the books 
        // we replace the .find by query.exec() to wait for the query to execute
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            //we pass here the searchOptions as specified in the index.ejs
            searchOptions: req.query
        }
        )
    } catch {
        res.redirect('/')
    }
})

//New book route, this is displaying the creation form
router.get('/new', async (req,res) => {
    //call of the encaplusated function
    renderNewPage(res, new Book())
})

//this is for creating the books (Create Book route)
/* UploadImage.11 set route parameter to accept files
by adding first a parameter to specifiy that we will upload only a single file 
this library knows how to upload the file into the exact place*/
router.post('/', upload.single('cover'), async (req,res) => {
    //UploadImage.12 then we test if file exists and get name out of it 
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description,
    })

    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch {
        //RemoveBookCover.2 : check if coverImage exists and call the remove function if it's the case
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})  

//RemoveBookCover.3 : here i specify the function to remove unwanted book covers
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath,fileName), err => {
        if(err) console.error(err)
    })
}
//SaveBook1 : a function to encapsulate all the logic for the create new book
async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        //SaveBook2 : to check if there is an error create a param that will get parameter variables first
        const params = {
            authors: authors,
            book: book
        }
        //SaveBook3 : check if there is the error
        if (hasError) params.errorMessage= 'Error Creating Book'
        //renders what we declared here up
        res.render('books/new', params)
     } catch {
       res.redirect('/books')
     }
}

module.exports = router