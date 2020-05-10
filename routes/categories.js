const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Book = require("../models/book");


//To list all the categories
router.get("/", async(req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name != "") {
        searchOptions.name = RegExp(req.query.name, "i");
    }
    try {
        const categories = await Category.find(searchOptions);
        res.render("categories/index", {
            categories: categories,
            searchOptions: req.query,
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
        res.redirect(`categories/${newCategory.id}`);
        //res.redirect("/categories")
        console.log("Category Created")
    } catch {
        res.render("categories/new", {
            category: category,
            errorMessage: "An error occured while creating Category"
        });
    }
})

//Methode pour avoir une catégorie by id
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render("categories/show", {
            category: category
        });
    } catch {
        res.redirect("/");
    }
})

//Methode get pour la page modifier pour remplir par la catégorie à modifier
router.get("/:id/edit", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render("categories/edit", { category: category })
    } catch {
        res.redirect("/categories");
    }
});

router.put("/:id", async(req,res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        category.name = req.body.name;
        await category.save()
        //for now we will show a log message instead of redirecting
        //console.log("Updated Successfully")
        // if successful redirect to category/id page
        res.redirect(`/categories/${category.id}`);
    } catch{
        if(category == null) {
            res.redirect("/");
        } else {
            res.render("category/edit", {
                category: category,
                errorMessage: "Error updating Category",
            });
        }
    }
});

module.exports = router //when there is the error message requires a middleware function