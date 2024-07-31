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
const restaurant_1 = __importDefault(require("../models/restaurant"));
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "restaurant not found" });
        }
        res.json(restaurant);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong" });
    }
});
const searchRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.query)
    try {
        const city = req.params.city;
        //search is sent as search query in req to backend
        //searchQuery is optional
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = req.query.selectedCuisines || ""; //an array separated with ,
        const sortOption = req.query.sortOption || "lastUpdated";
        const page = parseInt(req.query.page) || 1; //no. of pages of response
        let query = {}; //any type is used if type is complicated or multiple type may be considered
        //check if any restaurant availabe in the city if not return
        query["city"] = new RegExp(city, "i"); //go and get me all restaurant with city field matches given city (case insensitive -i) 
        const cityCheck = yield restaurant_1.default.countDocuments(query); //returns a no.         
        if (cityCheck === 0) {
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                },
            }); //frontend excepts an array
        }
        if (selectedCuisines) {
            const cuisinesArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray }; //finding all restaurants where cuisines array contains all items that we received in req
        }
        if (searchQuery) {
            //restaurantName=pizza place
            //cuisines=[pizza,pasta]
            //searchQuery =pasta
            const searchRegex = new RegExp(searchQuery, "i");
            //or statement is added to query ,for each restaurant name in docs search for restaurant name or check or any of the cuisine
            query["$or"] = [
                {
                    restaurantName: searchRegex
                },
                {
                    cuisines: { $in: [searchRegex] } // any of the cuisines array for any matches (not all match)
                },
            ];
        }
        const pageSize = 10;
        const skip = (page - 1) * pageSize; //how many records has to be skipped  based on page size to get the result
        const restaurants = yield restaurant_1.default.find(query).sort({ [sortOption]: 1 }).skip(skip).limit(pageSize).lean(); //lean strips out all mongoose ids and meta data and return js obj 
        //as sortOption is dynamically selected so it is placed in array
        const total = yield restaurant_1.default.countDocuments(query);
        //pagination and data has to be returned
        const response = {
            data: restaurants,
            pagination: {
                total, //50
                page, //current page
                pages: Math.ceil(total / pageSize), //  (50/10) =5
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong" });
    }
});
exports.default = {
    searchRestaurant, getRestaurant
};
