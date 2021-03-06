var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user.js");

//root setup
router.get("/",function(req,res){
	res.render("landing",{currentUser:req.user});
})


//=============================================================================================================
//AUTH ROUTES
//=============================================================================================================


//show register form
router.get("/register",function(req,res){
	res.render("register",{currentUser:req.user});
})

//handle sign-up logic
router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err)
			{
				req.flash("error",err.message);
				return res.render("register");
			}
		else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp "+ user.username);
				res.redirect("/campgrounds");
			})
		}
	})
})

//login routes

//login form page
router.get("/login",function(req,res){
	res.render("login",{currentUser:req.user});
})

//login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	res.send("Login logic happens here...")
})

//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!")
	res.redirect("/campgrounds");
})



//isloggedin
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports=router;