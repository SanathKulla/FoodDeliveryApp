"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//router is a mini- app to handle routes in different places of app
const express_1 = __importDefault(require("express"));
const MyUserController_1 = __importDefault(require("../controllers/MyUserController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, MyUserController_1.default.getCurrentUser);
//authenticated backend endpoint is created
router.post("/", auth_1.jwtCheck, MyUserController_1.default.createCurrentUser); //handler is called if there is a post request to /api/my/user 
//it handles control to provided handler (handler to create user)
router.put("/", auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateMyUserRequest, MyUserController_1.default.updateCurrentUser);
exports.default = router;
