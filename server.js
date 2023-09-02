const express = require("express");
const path = require("path");
const app = express();
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");

//Db
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/my-recipes")
  .then(() => console.log("CONNECTION OPEN!!"))
  .catch((err) => {
    console.log(err, "Oops error");
  });

const Recipe = require("./models/Recipes");
const Progress = require('./models/Progress')

//Template Engine
app.set("views", path.join(__dirname, "contents"));
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//form override
app.use(methodOverride("_method"));




// 
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter
  const perPage = 5; // Number of items per page

  try {
    const totalCount = await Recipe.countDocuments(); // Count total number of documents
    const totalPages = Math.ceil(totalCount / perPage);

    const recipes = await Recipe.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("index", { recipes, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
});






app.post("/", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter
  const perPage = 5; // Number of items per page

  try {
    const totalCount = await Recipe.countDocuments({
      name: { $regex: req.body.search, $options: "i" },
    }); // Count total number of matching documents
    const totalPages = Math.ceil(totalCount / perPage);

    const recipes = await Recipe.find({
      name: { $regex: req.body.search, $options: "i" },
    })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render("index", {
      recipes,
      currentPage: page,
      totalPages,
      searchQuery: req.body.search, // Pass the search query to the template
    });
  } catch (error) {
    next(error);
  }
});
//








app.get("/recipe/new", async (req, res, next) => {
  res.render("new");
});

app.post("/recipe", async (req, res) => {
  const recipe = new Recipe(req.body.recipe);
  await recipe.save();
  res.redirect("/");
});

app.get("/recipe/:id", async (req, res, next) => {
  try {
    const recipes = await Recipe.findById(req.params.id).populate('progress');
    res.render("show", { recipes });
  } catch (e) {
    next(e);
  }
});

app.get("/recipe/:id/edit", async (req, res, next) => {
  try {
    const recipes = await Recipe.findById(req.params.id);
    res.render("edit", { recipes });
  } catch (e) {
    next(e);
  }
});

app.post('/recipe/:id/progress', async(req, res) =>{
  const recipes = await Recipe.findById(req.params.id)
  const progress = new Progress(req.body)
  recipes.progress.push(progress)

  await progress.save()
  await recipes.save()

  res.redirect(`/recipe/${req.params.id}`)
})

app.put("/recipe/:id", async (req, res, next) => {
  try {
    const recipes = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body.recipe
    );
    res.redirect(`/recipe/${recipes.id}`);
  } catch (e) {
    next(e);
  }
});

app.delete("/recipe/:id", async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.delete('/recipe/:id/progress/:Pid/item', async(req,res) => {
  const recipes = await Recipe.findByIdAndUpdate(req.params.id,{$pull: {progress: req.params.Pid}})
  const progress = await Progress.findByIdAndDelete(req.params.Pid)
  res.redirect(`/recipe/${req.params.id}`)
})

app.use((err, req, res, next) => {
  console.log('Oops something went wrong!',err);
  next(err);
});

app.listen("8080", () => {
  console.log("LISTENING TO PORT 8080");
});
