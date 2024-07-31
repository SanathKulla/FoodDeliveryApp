"use strict";
//validating requests for updates
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMyRestaurantRequest = exports.validateMyUserRequest = void 0;
const express_validator_1 = require("express-validator");
//adding a middle that adds validate logic to request
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req); //extracts validation errors of express requests
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
});
//express validator package is used
//declared as an array to use it as middleware to routes ,as array lets to  add individual pieces of middle ware using single variable 
exports.validateMyUserRequest = [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("name must be a string"),
    (0, express_validator_1.body)("addressLine1").isString().notEmpty().withMessage("addressLine1 must be a string"),
    (0, express_validator_1.body)("city").isString().notEmpty().withMessage("city must be a string"),
    (0, express_validator_1.body)("country").isString().notEmpty().withMessage("country must be a string"),
    handleValidationErrors,
];
//whenever there is request for updating user profile then express validator
//checks the request based on  the things defined in above array
//after that it calls handleValidationErrors middleware 
//it add all errors to req ,if errors are found then 400 response is sent back to calling client(frontend)
exports.validateMyRestaurantRequest = [
    (0, express_validator_1.body)("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("deliveryPrice")
        .isFloat({ min: 0 })
        .withMessage("Delivery price must be a positive number"),
    (0, express_validator_1.body)("estimatedDeliveryTime")
        .isInt({ min: 0 })
        .withMessage("Estimated delivery time must be a postivie integar"),
    (0, express_validator_1.body)("cuisines")
        .isArray()
        .withMessage("Cuisines must be an array")
        .not()
        .isEmpty()
        .withMessage("Cuisines array cannot be empty"),
    (0, express_validator_1.body)("menuItems").isArray().withMessage("Menu items must be an array"),
    (0, express_validator_1.body)("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    (0, express_validator_1.body)("menuItems.*.price")
        .isFloat({ min: 0 })
        .withMessage("Menu item price is required and must be a postive number"),
    handleValidationErrors,
];
