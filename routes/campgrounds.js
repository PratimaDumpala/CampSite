var express=require("express");
var router=express.Router();
var Campground=require("../models/campground.js")
var User=require("../models/user.js");
var middleware=require("../middleware")


//===========================================================================================================
//Campground Routes
//===========================================================================================================


//INDEX
router.get("/",function(req,res){
	
	//get all campgrounds from database
	Campground.find({},function(err,allCampgrounds){
		if(err)
			{
				console.log(err);
			}
		else{
			res.render("campground/index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	})
	
	
	
})

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={
		name:name,
		image:image,
		description:desc,
		author:author
	}
	// Create a new campground and save to database
	Campground.create(newCampground,function(err,newlyCreated)
					 {
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("campgrounds");
		}
	})
	
})

//NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campground/new.ejs",{currentUser:req.user});
})

//SHOW
router.get("/:id",function(req,res)
	   {
	//find campground w id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
			if(err)
				{
					console.log(err);
				}
		else{
			res.render("campground/show",{campground: foundCampground,currentUser:req.user});
		}
	})
	
	//render show template
	
	
})

//EDIT CAMPGROUND

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	//is user logged in
	
			Campground.findById(req.params.id,function(err,foundCampground){			
					res.render("campground/edit",{campground:foundCampground});	
			})
			
		
	//if not redirect
	//does user own the campground
	//otherwise redirect
	//yes user owns it
	
	
})

//UPDATE CAMPGROUND

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
})

//DELETE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else{
			req.flash("success","Campground deleted.");
			res.redirect("/campgrounds");
		}
	})
})

//isloggedin



module.exports=router;