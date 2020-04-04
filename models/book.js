const mongoose = require('mongoose')
//Fl.3 specifiy for the coverImageBasePath the destination where it will be stored | we need it also for the search
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'
//Create a schema for books
const bookSchema = new mongoose.Schema({
   title : {
       type: String,
       required: true
   },
   description : {
       type: String,
   },
   publishDate: {
       type: Date,
       required: true
   },
   pageCount: {
       type: Number,
       required: true
   },
   createdAt: {
       type: Date,
       required: true,
       default: Date.now
   },
   coverImageName: {
       type: String,
       required: true
   },
   author: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'Author'
   }
})

//to create a virtual property that gets from the others properties
bookSchema.virtual('coverImagePath').get(function() {
    //A function to check the coverImageName and create the path with it
    if(this.coverImageName != null) {
        //Join the path lib, the images folders and the imageName
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

//the schema authorSchema defines the table Author
module.exports = mongoose.model('Book', bookSchema)
// Fl.4 export this and set it to coverImageBasePath
module.exports.coverImageBasePath = coverImageBasePath