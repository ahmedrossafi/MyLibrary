//check if we are running in the prod on not
//load dotenv if in dev,load all the vars from dotenv file to process.env in the app
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Importer Express depuis la librairie installée par npm
const express = require('express')

//passer la fonction express ici
const app = express()

//appeler le package expressLayouts
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

//créer la réference de l'index route
const indexRouter = require('./routes/index')
// référence de route pour les auteurs
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

//Confiugration de l'application express
//Mise en place de l'engine de view avec du ejs
app.set('view engine', 'ejs')

//Toutes les vues seront enregistrés dans le dossier views
app.set('views', __dirname + '/views')

//Déclaration du layout file pour optimiser la répétition et duplication des entetes et pieds de pages sur les autres pages par exemple
app.set('layout', 'layouts/layout')

//dire à express d'utiliser le expressLayouts pour la partie layout
app.use(expressLayouts)

//mettre tout les fichiers static du projet dans un dossier static('public')
app.use(express.static('public'))
//urlencoded is because the variables are going to be sent via url, and we increase the limit by 10
app.use(bodyParser.urlencoded({ limit: '10mb' , extended: false }))

//import mongoose into the backend
const mongoose = require('mongoose')

//connect and set the url(it has to be url from env var to be generic)
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

//check if we are connected or not to the database
const db = mongoose.connection
//pour le cas de l'erreur
db.on('error', error => console.error(error))
//dans le cas connecté
db.once('open', function() {
    console.log('Connected to Mongoose')
})

//utiliser l'index route, il faut préciser la route et l'index à gérer(handle)
app.use('/', indexRouter)

//chaque route dans le authorRouter sera suivie d'authors
app.use('/authors', authorRouter)
//appel de route for books
app.use('/books', bookRouter)

//Ecouter sur un port en mode prod || dev
app.listen(process.env.PORT || 3000)

