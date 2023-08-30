const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/my-recipes")
//   .then(() => console.log("CONNECTION OPEN!!"))
//   .catch((err) => {
//     console.log(err, "Oops error");
//   });

const recipeSchema = new Schema({
  name: String,
  ingredients:String,
  instructions: String,
  cookingTime: String,
  image: String,
  tags: String,
  source:String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// const recipe = new Recipe({
//   name: "Adobo",
//   ingredients:"Filipino adobo is a dish made by marinating chicken or pork in a mixture of soy sauce, vinegar, garlic, bay leaves, peppercorns, and optional brown sugar, then simmering it to create a savory and flavorful meal.",
//   instructions: `Create a flavorful masterpiece with Filipino Chicken Adobo. Marinate chicken pieces in a blend of soy sauce, vinegar, garlic, and aromatic spices. Simmer to perfection, allowing the tender meat to absorb the rich, tangy flavors. Serve this iconic dish with steamed rice for a delightful culinary experience that balances savory, sweet, and tangy notes`,
//   cookingTime: "Usually takes around 30 to 40 minutes.",
//   image:
//     "https://cdn.dribbble.com/users/50961/screenshots/2532578/media/af1a6e1f60343d89741199c8dda7fd34.jpg",
//   tags: 
//     "Filipino Dish and a Family favorite"
//    ,
//   source: "Tito rizal",
// });


// recipe.save().then(x => console.log(x))
module.exports = Recipe;
