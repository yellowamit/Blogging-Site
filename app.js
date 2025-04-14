//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose")


mongoose.connect("mongodb+srv://admin-amit:12345@cluster0.1xhvswt.mongodb.net/postDb?retryWrites=true&w=majority&appName=Cluster0");
const postSchema=new mongoose.Schema({title:String,content:String});
const postModel=mongoose.model("post",postSchema);
 

// for lodash
// Load the full build.
const _= require('lodash');
// Load the core build.
// var _ = require('lodash/core');
// // Load the FP build for immutable auto-curried iteratee-first data-last methods.
// var fp = require('lodash/fp');
 
// // Load method categories.
// var array = require('lodash/array');
// var object = require('lodash/fp/object');
 
// // Cherry-pick methods for smaller browserify/rollup/webpack bundles.
// var at = require('lodash/at');
// var curryN = require('lodash/fp/curryN');




// lodash close







const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts=[];


app.get("/", async function(req, res){
  try {
    posts = await postModel.find({});
  
  } catch (error) {
    console.error("Error retrieving the collection:", error);
  }
  res.render("home", { startingContent: homeStartingContent,posts:posts});
});
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
// compose part
app.get("/compose", (req, res) => {
  res.render("compose");
});
//object to store post

app.post("/compose", (req, res) => {
  // var post={
  //   title:req.body.postTitle,
  //   content: req.body.postBody
  // };
  // posts.push(post);
  const post=new postModel({title:req.body.postTitle,content:req.body.postBody});
  console.log(post);
  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error saving post:", err);
      res.status(500).send("An error occurred while saving the post.");
    });
});





//for params
// app.get("/posts/:postId",(req,res)=>{
//   const requestedTreq.params.post);

//   posts.forEach((post)=>{
//     if(_.lowerCase(post.title)===requestedTitle){
//       res.render("post",{title:post.title,content:post.content});
//       // break;
//     }
//   })

  
 

// });
app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    // Use the findById method to fetch the post using its _id
    const post = await postModel.findById(requestedPostId);

    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      res.status(404).send("Post not found.");
    }
  } catch (err) {
    console.error("Error fetching the post:", err);
    res.status(500).send("An error occurred while fetching the post.");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
