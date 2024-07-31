//multer middleware

import multer from "multer";
import express from "express";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";
const router=express.Router();

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024,//5mb
    }
});

//api/my/restaurant
//multer is going to check for imageFile field
router.post("/",
upload.single("imageFile"),
validateMyRestaurantRequest,
jwtCheck,
jwtParse,
MyRestaurantController.createMyRestaurant);

router.get("/",jwtCheck,jwtParse,MyRestaurantController.getMyRestaurant)

router.get("/order",jwtParse,MyRestaurantController.getMyRestaurantOrders);
//patch -used to update part of entity
router.patch("/order/:orderId/status",jwtCheck,jwtParse,MyRestaurantController.updateOrderStatus)
router.put("/",
upload.single("imageFile"),
validateMyRestaurantRequest,
jwtCheck,
jwtParse,
MyRestaurantController.updateMyRestaurant);
export default router;