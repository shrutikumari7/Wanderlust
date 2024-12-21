const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB=async ()=>{
    await Listing.deleteMany({});         //agar pehle se data hai toh delete karo
    initData.data=initData.data.map((obj)=>({...obj,owner:"675b04866e7722ca23f24de1"}));        //yeh sara listing ka data mai owner ko add kr dega
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();