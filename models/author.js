const mongoose = require('mongoose')
//Create a schema for authors
const authorSchema = new mongoose.Schema({
   name : {
       type: String,
       required: true
   } 
})

//the schema authorSchema defines the table Author
module.exports = mongoose.model('Author', authorSchema)