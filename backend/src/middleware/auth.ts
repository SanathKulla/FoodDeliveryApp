//handling authentication
import jwt from "jsonwebtoken";
import { NextFunction,Response,Request } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import User from "../models/user";

//to add custom properties to request  in express
declare global{
  namespace Express{
    interface Request{
    userId:string;
    auth0Id:string;
    }
  }
}

//WHENEVER WE ADD JWTCHECK FN AS MIDDLE WARE TO ROUTES THEN EXPRESS PASS REQUEST TO AUTH FN
//it checks autherisation header(frontend) which has bearer token in it,
//it is passed to the fn  and validates the token whether it is of a logged in user or not
export const jwtCheck = auth({//fn provided by auth0 server
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256",
  });

//middleware to find user token
//jwtParse calls updateCurrentUser
export const jwtParse=async (req:Request,res:Response,next:NextFunction)=>{
   //get access token from autherization header from req
   const {authorization}=req.headers;

   if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401);//not authorized if no authorization field in header or no bearer in authorization
   }
   //Bearer lsdjflsjdflj394789397rhdskhfk
   const token=authorization.split(" ")[1]; //we need to decode token for that we need jwt

  try{
   const decoded =jwt.decode(token) as jwt.JwtPayload;
  // console.log(decoded);//token
   const auth0Id=decoded.sub;
   const user=await  User.findOne({auth0Id});
   if(!user){
    return res.sendStatus(401);
   }
   //adding userid and auth0id to put request
   req.auth0Id=auth0Id as string;
   req.userId=user._id.toString();
   next();
  }catch(error){
    console.log(error);
    return res.sendStatus(401);
  }
}