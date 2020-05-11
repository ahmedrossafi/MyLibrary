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

module.exports = mongoose.model('Category', categorySchema)