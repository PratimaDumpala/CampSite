var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var User=require("./models/user.js");
var Comment=require("./models/comment.js")
var Campground=require("./models/campground.js");
var seedDB=require("./seeds.js");


//requiring routes
var commentRoutes=require("./routes/comments.js");
var campgroundRoutes=require("./routes/campgrounds.js");
var authRoutes=require("./routes/auth.js");



mongoose.connect('mongodb://localhost/yelp_camp',{ useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb://Pratima:Augustana%237@cluster0-shard-00-00-ztqxy.mongodb.net:27017,cluster0-shard-00-01-ztqxy.mongodb.net:27017,cluster0-shard-00-02-ztqxy.mongodb.net:27017/yelp_camp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"))
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify',false);

app.locals.moment = require('moment');

//seedDB(); //seed the database

//Passport configuration

app.use(require("express-session")({
	secret:"Handmaid's Tale",
	resave:false,
	saveUninitialized:false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3000,function(){
	console.log("Server is running");
})