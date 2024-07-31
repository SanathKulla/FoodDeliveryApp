import {Request,Response} from "express";
import User from "../models/user";

//handles all api requests

const getCurrentUser=async (req:Request,res:Response)=>{
    try{
      const currentUser=await User.findOne({_id:req.userId});
      if(!currentUser){
        return res.status(404).json({message:"user not found!!"});
      }
      res.json(currentUser); 
    }catch(error){
      console.log(error);
      res.status(500).json({message:"something went wrong..."});
    }
}
const createCurrentUser=async (req:Request,res:Response)=>{ //type checking for req and response object
    //check if user exits
    //if not create user
    //return user obj to calling client (res)
    try{
       const {auth0Id}=req.body;
       const existingUser=await User.findOne({auth0Id});
       if(existingUser){
        console.log(existingUser);
        return res.status(200).send();
       }

       const newUser=new User(req.body);//body contains properties of user
       //these are passed to fronted after logining in ,then frontend sends to db to save
       await newUser.save();
       res.status(201).json(newUser.toObject()); //toObject is to convert bson to js object (plain js object)
    }catch(error){
        console.log(error);//500- internal server error
        res.status(500).json({message:"Error creating a user!"});
    }
}


const updateCurrentUser= async (req:Request,res:Response)=>{
  try{
    const {name,city,addressLine1,country}=req.body;
    const user=await User.findById(req.userId);

    if(!user){
        return res.status(404).json({message:"user not found!"});
    }

    user.name=name;
    user.city=city;
    user.addressLine1=addressLine1;
    user.country=country;

    await user.save();
    res.send(user);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Error updating the user!"});
  }
}

//if there are more functions to export all we are using obj

export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
}