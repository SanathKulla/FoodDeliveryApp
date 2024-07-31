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
exports.jwtParse = exports.jwtCheck = void 0;
//handling authentication
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const user_1 = __importDefault(require("../models/user"));
//WHENEVER WE ADD JWTCHECK FN AS MIDDLE WARE TO ROUTES THEN EXPRESS PASS REQUEST TO AUTH FN
//it checks autherisation header(frontend) which has bearer token in it,
//it is passed to the fn  and validates the token whether it is of a logged in user or not
exports.jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256",
});
//middleware to find user token
//jwtParse calls updateCurrentUser
const jwtParse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get access token from autherization header from req
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.sendStatus(401); //not authorized if no authorization field in header or no bearer in authorization
    }
    //Bearer lsdjflsjdflj394789397rhdskhfk
    const token = authorization.split(" ")[1]; //we need to decode token for that we need jwt
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        // console.log(decoded);//token
        const auth0Id = decoded.sub;
        const user = yield user_1.default.findOne({ auth0Id });
        if (!user) {
            return res.sendStatus(401);
        }
        //adding userid and auth0id to put request
        req.auth0Id = auth0Id;
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }
});
exports.jwtParse = jwtParse;
