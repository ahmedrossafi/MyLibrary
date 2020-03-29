//importer express car il sera utilisé partout dans le projet
const express = require('express')
//declarer la variable router à laquelle je passerais
const router = express.Router()
//les paramètres req et res + l'url
router.get('/', (req, res) => {
    res.render('index')
}) 

//it serves to match the require and to give access for the imports (it maches the route var in server.js)
module.exports = router