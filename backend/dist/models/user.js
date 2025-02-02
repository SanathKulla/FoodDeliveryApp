"use strict";
//creating schema(that stores properties of users) for users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    auth0Id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    addressLine1: {
        type: String,
    },
    country: {
        type: String,
    },
});
const User = mongoose_1.default.model("User", userSchema); //collection name,schema name
exports.default = User;
