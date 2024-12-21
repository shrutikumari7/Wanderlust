if(process.env.NODE_ENV !="production"){                   
   require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");            //ejs ko setup krne ke liye
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");                   //help to create templates or layouts
const ExpressError=require("./utils/ExpressError.js");            
const session=require("express-session");
const MongoStore=require('connect-mongo')                 
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));            //first aur yeh wala line index route ke liye
app.use(express.urlencoded({extended:true}));              //show route ke liye
app.use(methodOverride("_method"));                         //update route ke liye
app.engine('ejs',ejsMate);                                  //for templating or layout
app.use(express.static(path.join(__dirname,"/public")));            //static file ko use krne ke liye


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 *24 *60 *60 *1000,
        maxAge:7 *24 *60 *60 *1000,
        httpOnly:true
    }
};


// app.get("/",(req,res)=>{
//     res.send("hii..im working");
// });




app.use(session(sessionOptions));
app.use(flash());                   //flash ko hamesha routes se pehle use karna hoga


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());                      //serialize ka mtlb data store karna or deserialize ka mtlb data remove karna after the session is end
passport.deserializeUser(User.deserializeUser());



// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1300,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



     //just a demo for signup
// app.get("/demouser", async(req,res)=>{
//      let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//    let registeredUser=await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// })




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{                             //agr upar wale mai se koi bhi route nhi hoga toh woh yeh wala error show karega
    next(new ExpressError(404,"Page not found!"));
})

//error handling middleware..........
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})


app.listen(8080,()=>{
    console.log("server is listening");
});