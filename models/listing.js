const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new  Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
    //     filename:{
    //         type:String,
    //         default:"listingimage"
    //     },
    //     url:{
        
    //     type:String,
    //     default:"https://mapmygenome.in/cdn/shop/articles/How_to_Stay_Healthy_While_Traveling_-_Tips_and_Insights_for_a_Safe_Journey.webp?v=1718688910",
    //     set:(v)=>{
    //         return v===""||v==null
    //         ?
    //         "https://mapmygenome.in/cdn/shop/articles/How_to_Stay_Healthy_While_Traveling_-_Tips_and_Insights_for_a_Safe_Journey.webp?v=1718688910"
    //         :v;
    //     },
    // },

    url:String,
    filename:String,
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
   
});

//for deleting the reviews when we delete the list
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;