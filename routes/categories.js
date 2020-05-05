const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Book = require("../models/book");


//To list all the categories
router.get("/", async(req, res) => {
    try {
        const category = await Category.find()
        res.render("categories/index", {
            categories: categories
        })
    } catch {
        res.redirect("/")
    }
})

//Afficher la forme de création d'une nouvelle catégorie
router.get("/new", (req, res) => {
    res.render("categories/new", { category: new Category() });
});

//Route : Créer une nouvelle catégorie
router.post("/", async(req, res) => {
    const category = new Category({
        name: req.body.name,
    });
    try {
        const newCategory = await category.save();
        //res.redirect("/");
        //console.log("Created");
        //res.redirect(`categories/${newCategory.id}`);
        res.redirect("/categories")
        console.log("Category Created")
    } catch {
        res.render("categories/new", {
            category: category,
            errorMessage: "An error occured while creating Category"
        });
    }
})

module.exports = router //when there is the error message requires a middleware function