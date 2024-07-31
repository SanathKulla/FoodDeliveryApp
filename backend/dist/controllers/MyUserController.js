"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
//handles all api requests
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            return res.status(404).json({ message: "user not found!!" });
        }
        res.json(currentUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong..." });
    }
});
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if user exits
    //if not create user
    //return user obj to calling client (res)
    try {
        const { auth0Id } = req.body;
        const existingUser = yield user_1.default.findOne({ auth0Id });
        if (existingUser) {
            console.log(existingUser);
            return res.status(200).send();
        }
        const newUser = new user_1.default(req.body); //body contains properties of user
        //these are passed to fronted after logining in ,then frontend sends to db to save
        yield newUser.save();
        res.status(201).json(newUser.toObject()); //toObject is to convert bson to js object (plain js object)
    }
    catch (error) {
        console.log(error); //500- internal server error
        res.status(500).json({ message: "Error creating a user!" });
    }
});
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, city, addressLine1, country } = req.body;
        const user = yield user_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "user not found!" });
        }
        user.name = name;
        user.city = city;
        user.addressLine1 = addressLine1;
        user.country = country;
        yield user.save();
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating the user!" });
    }
});
//if there are more functions to export all we are using obj
exports.default = {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
};
