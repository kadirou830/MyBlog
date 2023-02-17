//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://admin-kd:1980@cluster0.y5cswcl.mongodb.net/blogdb",
  //"mongodb://127.0.0.1:27017/todolistdb",
  () => {
    console.log("DB connected");
  },
  (e) => console.log(e)
);

const blogSchema = new mongoose.Schema({
  title: String,    
  post: String
});

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent = "In its most general sense, the term world refers to the totality of entities, to the whole of reality or to everything that is.[1] The nature of the world has been conceptualized differently in different fields. Some conceptions see the world as unique while others talk of a  Some treat the world as one simple object while others analyze the world as a complex made up of many parts. In scientific cosmology the world or universe is commonly defined as . Theories of modality, on the other hand, talk of possible worlds as complete and consistent ways how things could have been. Phenomenology, starting from the horizon of co-given objects present in the periphery of every experience, defines the world as the biggest horizon or the . In philosophy of mind, the world is commonly contrasted with the mind as that which is represented by the mind.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  Blog.find((e, posts) => {
    if (e) {
      console.log(e);
    } else {
    res.render('home', {myHomeStartingContent: homeStartingContent, myPosts: posts});
    }
  });

})

app.get("/about", function(req, res){
  res.render('about', {myAboutContent: aboutContent});
})

app.get("/contact", function(req, res){
  res.render('contact', {myContactContent: contactContent});
})

app.get("/compose", function(req, res){
  res.render('compose');
})

app.post("/compose", function (req, res){
  let mypostTitle = req.body.postTitle;
  let mypostBody = req.body.postBody;
  const myPost = new Blog({ title: mypostTitle, post: mypostBody });
  myPost.save().then(()=> console.log(myPost.title + " added"))
  res.redirect("/");
})

app.get('/post/:postName', function(req, res){
  let myPostName =  _.lowerCase(req.params.postName) ;     
  Blog.find((e, posts) => {
    posts.forEach(element => {
    let postToMatch = _.lowerCase(element.title)
    if (postToMatch === myPostName) {
      res.render('post', {myPostTitle: element.title, myPostBody: element.post});
    }
  })
  });
  
})


let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000
}

app.listen(port, function(){
    console.log("server has started on port succefully " );
})


