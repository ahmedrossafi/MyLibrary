const mongoose = require('mongoose')
const Book = require('./book')
const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    }
})

/*
To do : 
Ajouter une fonction pre qui permet de vérifier avant 
de supprimer un livre par rapport à sa catégorie ?
*/
categorySchema.pre('remove', function(next) {
    Book.find( { category: this.id } , (err, books) => {
        if(err) {
            next(err)
        } else if(books.length > 0) {
            next(new Error('Cannot delete category it has books'))
        } else {
            next()
        }
    } )
})

module.exports = mongoose.model('Category', categorySchema)