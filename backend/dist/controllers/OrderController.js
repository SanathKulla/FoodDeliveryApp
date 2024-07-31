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
const stripe_1 = __importDefault(require("stripe"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const Order_1 = __importDefault(require("../models/Order"));
//order endpoints logic
const STRIPE = new stripe_1.default(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ user: req.userId }).populate("restaurant").populate("user");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
//webhook sends event created by payment  in stripe
//to access that stripe is installed in local system
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //webhook is used to receive  req from any third party
    //  console.log("RECEIVED EVENT")
    //  console.log("==========")
    //  console.log("event: ",req.body);
    //  res.send();//sending acknowledgement to stripe after successfully receiving event
    var _a;
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        //below one works only if event is passed from stripe
        event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_ENDPOINT_SECRET);
        //stripe checks whether the request has come from stripe endpoint secret if so event is constructed
        //else error is thrown
        //this restrict any one from posting a request to webhook endpoint to make an order
    }
    catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    if (event.type == "checkout.session.completed") {
        const order = yield Order_1.default.findById((_a = event.data.object.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }
        order.totalAmount = event.data.object.amount_total;
        order.status = "paid",
            yield order.save();
    }
    res.status(200).send();
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createLineItems = (checkoutSessionRequest, menuItems) => {
        //foreach cartItem ,get menuItem obj from restaurant
        //to get price of menuItems
        //2. for each item ,convert it to a stripe line item
        //3. return line item array
        const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
            const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());
            if (!menuItem) {
                throw new Error(`Menu item not found : ${cartItem.menuItemId}`);
            }
            const line_item = {
                price_data: {
                    currency: "INR",
                    unit_amount: menuItem.price,
                    product_data: {
                        name: menuItem.name,
                    },
                },
                quantity: parseInt(cartItem.quantity),
            };
            return line_item;
        });
        return lineItems;
    };
    const createSession = (lineItems, orderId, deliveryPrice, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
        const sessionData = yield STRIPE.checkout.sessions.create({
            line_items: lineItems,
            shipping_options: [
                {
                    shipping_rate_data: {
                        display_name: "Delivery",
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: deliveryPrice,
                            currency: "INR",
                        },
                    },
                },
            ],
            mode: "payment",
            metadata: {
                orderId,
                restaurantId,
            },
            success_url: `${FRONTEND_URL}/order-status?success=true`,
            cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
        });
        return sessionData;
    });
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield restaurant_1.default.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        const newOrder = new Order_1.default({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        });
        //for models (restaurants ,user ,...) type is figured by typescript ,for types embedded in models type has to me mentioned
        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems); //cartitems delivery price quantity
        //lineItems has to be sent to stripe
        const session = yield createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant._id.toString());
        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe session" });
        }
        yield newOrder.save(); //saving after  checkout session is successful
        console.log(session.url);
        res.json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
    ;
});
exports.default = {
    createCheckoutSession, stripeWebhookHandler, getMyOrders,
};
