import mongoose, { InferSchemaType } from "mongoose";

const menuItemSchema=new mongoose.Schema({
_id:{type:mongoose.Schema.Types.ObjectId,required:true,default:()=>new mongoose.Types.ObjectId()},// this is done to access id when type is referened
//_id is overwritting the default behaviour of mongoose which adds id automatically
//by specifying default and fn in it we are making mongoose to add id whenever it is not provided else we need to add id 
name: { type: String, required: true},
price: { type: Number, required: true},

});

//this is done to automatically detect the schema of menuItems
export type MenuItemType=InferSchemaType<typeof menuItemSchema>;
const restaurantSchema=new mongoose.Schema({
    //refering to user who is creating a restaurant
    //ref is used to link docs of one collection with docs of other collections ,this is called population
    user: { type:mongoose.Schema.Types.ObjectId, ref: "User" },//user objectid is _id of user in User collection
    restaurantName: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    deliveryPrice: {type: Number, required: true},
    estimatedDeliveryTime: {type: Number, required: true},
    cuisines: [{type: String, required: true}],//array of strings
    menuItems: [menuItemSchema],
    imageUrl: {type: String, required: true},
    lastUpdated: {type: Date, required: true},
});

const Restaurant=mongoose.model("Restaurant",restaurantSchema);
export default Restaurant;

