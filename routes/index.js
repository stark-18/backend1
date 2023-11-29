var express = require('express');
var router = express.Router();
const passport = require("passport");
const userModal = require("./users");
const postsModal = require("./posts");

const localStrategy = require("passport-local"); 
const upload = require('./multer');
passport.use(new localStrategy(userModal.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  // console.log(req.flash('error')); 
  res.render('login', { error : req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload',isLoggedin, upload.single("file") ,async function(req, res, next) {
  if(!req.file){
     return res.status(404).send("no files were given");
  }
  //jo file upload hui hai use save karo as a post aur post ka postid user ko do aur post ko user id do
  const user = await userModal.findOne({username : req.session.passport.user});
  const post = await postsModal.create({
    image: req.file.filename,
    imageText : req.body.filecaption ,
    user : user._id,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.get('/profile',isLoggedin, async function(req, res, next) {
  const user = await userModal.findOne({
    username : req.session.passport.user
  })
  .populate("posts");
  // console.log(user);
  res.render("profile",{user});
});

router.post ("/register", function(req, res){
  const { username, email, fullname } = req.body;
  const userData = new userModal({ username, email, fullname });

  userModal.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    });
  });
});

router.post("/login", passport.authenticate("local",{
   successRedirect : "/profile",
   failureRedirect : "/login",
   failureFlash : true,
}),function(req, res, next) {
});

router.get("/logout", function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function isLoggedin(req, res, next)  {
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
