const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController=require("../controllers/users.js");                      //for MVC

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}), userController.login );           //passport.authenticate() ek middleware h jo login se pehle hamare liye authentication ke liye use hota h 
   

router.get("/logout",userController.logout);


module.exports=router;