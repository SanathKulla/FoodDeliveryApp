"use strict";
//contains all endpoints to interact with restaurant
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const RestaurantController_1 = __importDefault(require("../controllers/RestaurantController"));
const router = express_1.default.Router();
router.get("/:restaurantId", (0, express_validator_1.param)("restaurantId").isString().trim().notEmpty().withMessage("restaurantId parameter must be a valid string"), RestaurantController_1.default.getRestaurant);
//validating requwst we get has a valid city parameter 
router.get("/search/:city", (0, express_validator_1.param)("city").isString().trim().notEmpty().withMessage("city parameter must be a valid string"), RestaurantController_1.default.searchRestaurant);
exports.default = router;
