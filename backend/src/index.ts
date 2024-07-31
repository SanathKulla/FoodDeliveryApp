//server code
import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import {v2 as cloudinary} from "cloudinary";
import {Request,Response} from "express";
import restaurantRoute from "./routes/RestaurantRoute"
import orderRoute from   "./routes/OrderRoute"
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("connected to database!!")).catch((err)=>console.log(err, " connection failed.."))
 //process.env is used to get vlaue from .env file
//casting in ts
//backend connects to cloudinary
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

const app=express();//creates express server 
app.use("/api/order/checkout/webhook",express.raw({type:"*/*"}));
//passing raw data to stripe -done for validation
app.use(express.json());//middleware to convert body of request api to json
//it  auotmatically converts body of request to json
app.use(cors());

//creating an api (endpoint ) that frontend gonna call to create a user
//creating user api
//any api that starts with /api/my/user is redirected to myUserRoute by express(middleware)

//adding an endpoint to server ,that we can call to check server has started

app.get("/health",(req:Request,res:Response)=>{
  res.send({message:"health ok!!"})
});

app.use("/api/my/user",myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute)
app.use("/api/restaurant/",restaurantRoute)
app.use("/api/order",orderRoute);
app.listen(7000,()=>{
    console.log("server started at port 7000");
})