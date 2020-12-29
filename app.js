//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { reset } = require("nodemon");
const  mongoose = require("mongoose");

const lodash = require("lodash") ; 
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
 
const http = require('http');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");
const app = express();
const server = http.createServer(app) ;
const postsh = [{postTitle:'Home Page',postBody:homeStartingContent}];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/blogDB",{useNewUrlParser:true , useUnifiedTopology:true }) ;

const postSchema = {
  postTitle :String ,
  postBody : String , 
};

const Post = mongoose.model("Post",postSchema);





app.get('/',(req,res)=>{
  
  Post.find({},(err,posts)=>{
    posts.unshift({
      postTitle:'Home Page',
      postBody: homeStartingContent , 
    });
   
    if(err)
    return res.render("home",{posth}
      )
    else
   {
     res.render("home",{
       posts
     })
    //console.log(posts);
   }

  })
  
  
})

app.get('/:id',(req,res)=>{
  const page = req.params.id;
  if(page=="about")
  res.render(page,{content :aboutContent});
  else 
  res.render(page,{content : contactContent}) ; 

})

app.get('/compose',(req,res)=>{
   res.render("compose");
   
})

app.post('/compose',(req,res)=>{
   const post = new Post({
      postTitle : req.body.postTitle , 
      postBody : req.body.postBody , 
   }) ; 
   post.save((err)=>{
     if(err)
     res.redirect("/");
   }) ;
   
   res.redirect("/");
  
   
   
})

app.get('/posts/',(req,res)=>{
  res.render("posts");
})


app.post('/posts/',(req,res)=>{
  const searchPage = req.body.postTitle;
  res.redirect('/posts/'+searchPage);
  
//  console.log('posts/'+searchPage);


})
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {post:{
      postTitle: post.postTitle,
      postBody: post.postBody
    }});
  });

});








var port_number = server.listen(process.env.PORT || 3000,()=>{
    console.log(`server is up and running on port 3000`) ; 
});