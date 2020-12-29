//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { reset } = require("nodemon");
const  mongoose = require("mongoose");
const objectID = mongoose.Types.ObjectId;



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

mongoose.connect("mongodb+srv://naman1611:123@cluster0.vjofi.mongodb.net/blogDB?retryWrites=true&w=majority/blogDB",{useNewUrlParser:true , useUnifiedTopology:true }) ;

const postSchema = {
  postTitle :String ,
  postBody : String , 
  postValidation: String,
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
      postValidation : lodash.lowerCase(req.body.postTitle) ,
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
     }})
   }
   else if(objectID.isValid(deleteTitle))
   {
     Post.findOne({_id:deleteTitle},(err,post)=>{
       if(err||post==null)
       return res.render("post",{post:{
         postTitle:'Invalid post',
         postBody:'No such post exits!',
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



var port_number = server.listen(process.env.PORT || 3000,()=>{
    console.log(`server is up and running on port 3000`) ; 
});