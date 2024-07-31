//validating requests for updates

import { NextFunction,Request,Response } from "express";
import { body, validationResult } from "express-validator";
//adding a middle that adds validate logic to request

const handleValidationErrors=async (req:Request,res:Response,next:NextFunction)=>{
    const errors=validationResult(req);//extracts validation errors of express requests

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    } 
    next();
}

//express validator package is used
//declared as an array to use it as middleware to routes ,as array lets to  add individual pieces of middle ware using single variable 
export const validateMyUserRequest=[
   body("name").isString().notEmpty().withMessage("name must be a string"),
   body("addressLine1").isString().notEmpty().withMessage("addressLine1 must be a string"),
   body("city").isString().notEmpty().withMessage("city must be a string"),
   body("country").isString().notEmpty().withMessage("country must be a string"),
   handleValidationErrors,
]
//whenever there is request for updating user profile then express validator
//checks the request based on  the things defined in above array
//after that it calls handleValidationErrors middleware 
//it add all errors to req ,if errors are found then 400 response is sent back to calling client(frontend)

export const validateMyRestaurantRequest=[
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("deliveryPrice")
      .isFloat({ min: 0 })
      .withMessage("Delivery price must be a positive number"),
    body("estimatedDeliveryTime")
      .isInt({ min: 0 })
      .withMessage("Estimated delivery time must be a postivie integar"),
    body("cuisines")
      .isArray()
      .withMessage("Cuisines must be an array")
      .not()
      .isEmpty()
      .withMessage("Cuisines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu items must be an array"),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price")
      .isFloat({ min: 0 })
      .withMessage("Menu item price is required and must be a postive number"),
    handleValidationErrors,
]