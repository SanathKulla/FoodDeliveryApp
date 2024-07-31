import mongoose from "mongoose";
import OrderController from "../controllers/OrderController";

const orderSchema=new mongoose.Schema({
    restaurant:{type:mongoose.Schema.Types.ObjectId,ref:"Restaurant"},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
     deliveryDetails:{
        email:{type:String,required:true},
        name:{type:String,required:true},
        addressLine1:{type:String,required:true},
        city:{type:String,required:true},
     },
     cartItems:[
        {
            menuItemId:{type:String,required:true},
            quantity:{type:String,required:true},
            name:{type:String,required:true},
        }
     ],
   
     status:{
        type:String,
        enum:[
            "placed","paid","inProgress","outForDelivery","deliverd"
        ],

     },
     totalAmount:{type:Number},
     createdAt:{type:Date,default:Date.now},
});
const Order=mongoose.model("Order",orderSchema);
export default Order;