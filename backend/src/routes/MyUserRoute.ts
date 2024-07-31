//router is a mini- app to handle routes in different places of app
import express from "express";
import MYUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";
const router = express.Router();

router.get("/",jwtCheck,jwtParse,MYUserController.getCurrentUser);


//authenticated backend endpoint is created
router.post("/", jwtCheck, MYUserController.createCurrentUser);//handler is called if there is a post request to /api/my/user 
//it handles control to provided handler (handler to create user)

router.put(
    "/",
     jwtCheck,
      jwtParse, 
      validateMyUserRequest,
       MYUserController.updateCurrentUser
    );

export default router;