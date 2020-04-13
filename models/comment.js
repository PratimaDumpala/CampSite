var mongoose=require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp',{ useNewUrlParser: true, useUnifiedTopology: true});



var commentSchema=new mongoose.Schema({
	text: String,
	createdAt:{
		type:Date,
		default:Date.now
	},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
});
module.exports=mongoose.model("Comment",commentSchema);
