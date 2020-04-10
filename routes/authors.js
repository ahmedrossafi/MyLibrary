//route for authors
const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//All authors route, i render the index of the authors
router.get('/', async (req, res) => {
    //variable to store the search options
    let searchOptions = {}
    //check if search field exists and is not empty
    if(req.query.name != null && req.query.name !== '') {
     // then pass name to the searchOptions respecting regex
     searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

//New author route, this is displaying the creation form
router.get('/new', (req,res) => {
    res.render('authors/new', { author: new Author() })
})

//this is for creating the author (Create Author route)
router.post('/', async (req,res) => {
    //here in order to create a new author in the database
    //i specified .name for security reasons, to not have a user send id inside body and reset the id
    const author = new Author({
        name: req.body.name
    })
    try {
        //here instead of callback we tell newAuthor to await for author to be saved and made in it, that way we have a new author
        const newAuthor = await author.save() 
        res.redirect(`authors/${newAuthor.id}`)
        //res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'An error occured while creating author'
        })
    }
})

//For to the show page of an author
router.get('/:id', async (req,res) => {
    //the req.params.id is to get all the parameters from the url
    try {
        //Declare the author and books vars and check if there is an author and has books
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(8).exec()
        //if all exist lead to the show page, else to the catch
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
    //res.send('Show Author ' + req.params.id)
})

//Get the edit page of an author
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
       res.redirect('/authors') 
    }
})

//For the updating of an author
router.put(':/id', async (req, res) => {
    let author
    try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
    } catch {
    if(author == null) {
        res.redirect('/')
    } else {
        res.render('author/edit', {
            author: author,
            errorMessage: 'Error updating Author'
        })
    }
}
})

//Delete an author
router.delete('/:id', async (req, res) => {
    let author //portee globale sur le try et le catch
    try {
    // find the author
    author = await Author.findById(req.params.id)
    //remove it
    await author.remove()
    //redirect to the authors page once done
    res.redirect('/authors')
    } catch {
        //if no author exists go to the list of authors
        if(author == null) {
            res.redirect('/')
        } 
        //if the author has books show his page and do not delete author
        else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router