//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { reset } = require("nodemon");
const  mongoose = require("mongoose");
const objectID = mongoose.Types.ObjectId;
require('dotenv').config();




const lodash = require("lodash") ; 
const homeStartingContent = "Welcome!  Add your blog post , delete your blog post and find other's posts :)";
const aboutContent = " This is a mini project that uses ejs as templating , expressJs as backend , libraries such as lodash , it performs basic , CRD operations with the use of MongoDB as database";
const contactContent = "Naman Girdhar , +91 8708485017 , namangirdhar16@gmail.com"; 
const http = require('http');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");
const app = express();
const server = http.createServer(app) ;
const postsh = [{postTitle:'Home Page',postBody:homeStartingContent}];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://naman1611:"+process.env.password+"@cluster0.vjofi.mongodb.net/blogDB?retryWrites=true&w=majority/blogDB",{useNewUrlParser:true , useUnifiedTopology:true }) ;

const postSchema = new mongoose.Schema({
  postTitle :String ,
  postBody : String , 
  postValidation: String,
  createdBy: String ,
  
},{timestamps:true});


const Post = mongoose.model("Post",postSchema);





app.get('/',(req,res)=>{
  
  Post.find({},(err,posts)=>{
    posts.unshift({
      
      postTitle:'Home Page',
      postBody: homeStartingContent , 
      createdBy: 'Admin',
      
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
      postValidation : lodash.lowerCase(req.body.postTitle) ,
      createdBy: req.body.createdBy,
   }) ; 
    post.save();
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
app.get("/posts/:postId", (req,res)=>{

const requestedPostId = req.params.postId;
  if(objectID.isValid(requestedPostId))
  {

    Post.findOne({_id: requestedPostId}, (err,post)=>{
    if(err)
    { console.log('error');
      return res.redirect("/");
    }
    else
    // res.render("post", {post:{
    //   postTitle: post.postTitle,
    //   postBody: post.postBody
    // }});
    {
      console.log(post);
      res.render("post",{post:
      post});
    }
  });
  }
  else{
    requestedPostSearch = lodash.lowerCase(requestedPostId);
    Post.findOne({postValidation:requestedPostSearch},(err,post)=>{
        if(err||post==null)
      return res.render("post",{post:{
        postTitle:'Invalid Search',
        postBody:'Oops, No Such post exists!',
        createdBy:'None',
      }})
      else
      res.render("post",{post:post});
      // console.log(post);
      // res.redirect("/");
    })

  }

 
  
  

});


app.get("/delete",(req,res)=>{
  res.render("delete");
})

app.post("/delete",(req,res)=>{
   const deleteTitle = lodash.lowerCase(req.body.postTitle);
   console.log(deleteTitle);
   if(deleteTitle==="home page")
   {
     return res.render("post",{post:{
       postTitle:`Sorry you don't have the access to delete home page content`,
       postBody: 'Delete Some Other post',
       createdBy:'None',
     }})
   }
   else if(objectID.isValid(deleteTitle))
   {
     Post.findOne({_id:deleteTitle},(err,post)=>{
       if(err||post==null)
       return res.render("post",{post:{
         postTitle:'Invalid post',
         postBody:'No such post exits!',
         createdBy:'None',
       }})
       res.redirect("/delete/"+post.postValidation) ;
     })
   }
   else{
     
     Post.findOne({postValidation:deleteTitle},(err,post)=>{
       
       if(err||post==null)
       return res.render("post",{post:{
         postTitle:'Invalid post',
         postBody:'No such post exits!',
         createdBy: 'None',
       }})
       res.redirect("/delete/"+post.postValidation) ;
     })
   }
})
app.get("/delete/:searchTitle",(req,res)=>{
   
   Post.deleteOne({postValidation:req.params.searchTitle}).then(()=>{
     console.log("post got deleted!");
     
   }).catch((err)=>{console.log('error')})
    res.redirect("/");
})

app.get("/deleteAll",(req,res)=>{
  Post.deleteAll({});
  res.redirect("/");
})

var port_number = server.listen(process.env.PORT || 3000,()=>{
    console.log(`server is up and running on port 3000`) ; 
});