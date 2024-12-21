const Joi=require('joi');

// module.exports.listingSchema=Joi.object({
//      listing:Joi.object({
//         title:Joi.string().required(),
//         description:Joi.string().required(),
//         location:Joi.string().required(),
//         price:Joi.number().required(),
//         country:Joi.string().required().min(0),
//         image:Joi.string().allow("",null)
//      }).required()
// });


module.exports.listingSchema = Joi.object({
   listing: Joi.object({
     title: Joi.string().required(),
     description: Joi.string().required(),
     location: Joi.string().required(),
     price: Joi.number().required(),
     country: Joi.string().required().min(0),
     image: Joi.object({
       filename: Joi.string().optional(),
       url: Joi.string().allow("", null).uri() // Validate URL format
     }).optional() 
   }).required()
 });

module.exports.reviewSchema=Joi.object({
   review:Joi.object({
      rating:Joi.number().required().min(1).max(5),
      comment:Joi.string().required(),
   }).required()
})