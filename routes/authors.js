//route for authors
const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//All authors route, i render the index of the authors
router.get('/', async (req, res) => {
    //variable to store the search options
    let searchOptions = {}
    //check if search field exists and is not empty
    if(req.query.name != null && req.query.name != '') {
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

    try{
        //here instead of callback we tell newAuthor to await for author to be saved and made in it, that way we have a new author
        const newAuthor = await author.save() 
        //res.redirect('authors/${newAuthor.id}')
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'An error occured while creating author'
        })
    }
    /*author.save((err, newAuthor) => {
        if(err) {
            res.render('authors/new', {
                author : author,
                errorMessage : 'An error occured while creating author'
            })
        } else {
            //res.redirect('authors/${newAuthor.id}')
            res.redirect(`authors`)
        }
    })*/
})

module.exports = router