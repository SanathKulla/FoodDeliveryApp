//contains all endpoints to interact with restaurant

import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router=express.Router();

router.get("/:restaurantId",param("restaurantId").isString().trim().notEmpty().withMessage("restaurantId parameter must be a valid string"),
RestaurantController.getRestaurant);
//validating requwst we get has a valid city parameter 
router.get("/search/:city",param("city").isString().trim().notEmpty().withMessage("city parameter must be a valid string")
,RestaurantController.searchRestaurant);

export default router;