"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//server code
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MyUserRoute_1 = __importDefault(require("./routes/MyUserRoute"));
const MyRestaurantRoute_1 = __importDefault(require("./routes/MyRestaurantRoute"));
const cloudinary_1 = require("cloudinary");
const RestaurantRoute_1 = __importDefault(require("./routes/RestaurantRoute"));
const OrderRoute_1 = __importDefault(require("./routes/OrderRoute"));
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING).then(() => console.log("connected to database!!")).catch((err) => console.log(err, " connection failed.."));
//process.env is used to get vlaue from .env file
//casting in ts
//backend connects to cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)(); //creates express server 
app.use("/api/order/checkout/webhook", express_1.default.raw({ type: "*/*" }));
//passing raw data to stripe -done for validation
app.use(express_1.default.json()); //middleware to convert body of request api to json
//it  auotmatically converts body of request to json
app.use((0, cors_1.default)());
//creating an api (endpoint ) that frontend gonna call to create a user
//creating user api
//any api that starts with /api/my/user is redirected to myUserRoute by express(middleware)
//adding an endpoint to server ,that we can call to check server has started
app.get("/health", (req, res) => {
    res.send({ message: "health ok!!" });
});
app.use("/api/my/user", MyUserRoute_1.default);
app.use("/api/my/restaurant", MyRestaurantRoute_1.default);
app.use("/api/restaurant/", RestaurantRoute_1.default);
app.use("/api/order", OrderRoute_1.default);
app.listen(7000, () => {
    console.log("server started at port 7000");
});
