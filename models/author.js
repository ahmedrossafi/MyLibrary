const mongoose = require('mongoose')
//Call the book schema that we will use to verify if an author has books
const Book = require('./book')
//Create a schema for authors
const authorSchema = new mongoose.Schema({
   name : {
       type: String,
       required: true
   } 
})

//use the book schema inside the pre
//the pre method exectues after any function inside of it
authorSchema.pre('remove' , function(next) {
   Book.find({ author: this.id } , (err, books) => {
        //if an author isn't found return an err
        if(err) {
            next(err)
            //if there are still books
        } else if(books.length > 0) {
            next(new Error('The author still has existing books'))
        } else {
            //if there is no book for the author then delete
            next()
        }
   })
})  

//the schema authorSchema defines the table Author
module.exports = mongoose.model('Author', authorSchema)