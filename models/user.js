const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
});

userSchema.plugin(passportLocalMongoose);       //passportLocalMongoose isko as a plugin isiliye use kiye kyuki yeh automatically findByUsername, hashing,salting,password generate kr deta h 

module.exports=mongoose.model("User",userSchema);
