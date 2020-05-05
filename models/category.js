const mongoose = require('mongoose')
const Book = require('./book')
const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Category', categorySchema)