import Stripe from "stripe";
import {Request,Response} from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/Order";
//order endpoints logic
const STRIPE=new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL=process.env.FRONTEND_URL as string; 
const STRIPE_ENDPOINT_SECRET=process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders=async (req:Request,res:Response)=>{
     try{
      const orders=await Order.find({user:req.userId}).populate("restaurant").populate("user")
      res.json(orders);
     }catch(error){
       
        res.status(500).json({message:"something went wrong"});
     }
}
type CheckoutSessionRequest={
    cartItems:{ //an array of objects
        menuItemId:string;
        name:string;
        quantity:string;
    }[];
    deliveryDetails:{
        email:string;
        name:string;
        addressLine1:string;
        city:string;
    };
    restaurantId:string;
};

//webhook sends event created by payment  in stripe
//to access that stripe is installed in local system
const stripeWebhookHandler=async(req:Request,res:Response)=>{
 //webhook is used to receive  req from any third party
//  console.log("RECEIVED EVENT")
//  console.log("==========")
//  console.log("event: ",req.body);
//  res.send();//sending acknowledgement to stripe after successfully receiving event

let event;
try{ 
    const sig=req.headers["stripe-signature"];
    //below one works only if event is passed from stripe
    event=STRIPE.webhooks.constructEvent(req.body,sig as string,STRIPE_ENDPOINT_SECRET);
    
    //stripe checks whether the request has come from stripe endpoint secret if so event is constructed
    //else error is thrown
    //this restrict any one from posting a request to webhook endpoint to make an order
}catch(error:any){
   return res.status(400).send(`Webhook error: ${error.message}`);
}
if(event.type=="checkout.session.completed"){
    const order=await Order.findById(event.data.object.metadata?.orderId);
   
    if(!order){
        return res.status(404).json({message:"order not found"});
    }

    order.totalAmount=event.data.object.amount_total;
   
    order.status="paid",
    await order.save();
}
res.status(200).send();
};

const createCheckoutSession=async (req:Request,res: Response)=>{
    const createLineItems=(checkoutSessionRequest:CheckoutSessionRequest,menuItems:MenuItemType[])=>{
        //foreach cartItem ,get menuItem obj from restaurant
        //to get price of menuItems
        //2. for each item ,convert it to a stripe line item
        //3. return line item array
 
        const lineItems=checkoutSessionRequest.cartItems.map((cartItem)=>{
         const menuItem=menuItems.find((item)=>item._id.toString()===cartItem.menuItemId.toString())
         if(!menuItem){
            throw new Error(`Menu item not found : ${cartItem.menuItemId}`);
         }

         const line_item:Stripe.Checkout.SessionCreateParams.LineItem={
            price_data:{
                currency:"INR",
                unit_amount:menuItem.price,
                product_data:{
                    name:menuItem.name,
                },
            },
            quantity:parseInt(cartItem.quantity),
         };
         return  line_item;
        });
        return lineItems;
     };

     const createSession=async (
        lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
        orderId:string,
        deliveryPrice:number,
        restaurantId:string
    )=>{
        const sessionData=await STRIPE.checkout.sessions.create({
            line_items:lineItems,
            shipping_options:[
                {
                  shipping_rate_data:{
                        display_name:"Delivery",
                        type:"fixed_amount",
                        fixed_amount:{
                            amount:deliveryPrice,
                            currency:"INR",
                        },
                    },
                },
            ],
            mode:"payment",
            metadata:{
                orderId,
                restaurantId,
            },
            success_url:`${FRONTEND_URL}/order-status?success=true`,
            cancel_url:`${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
        });
        return sessionData;
       }

    try{
     const checkoutSessionRequest:CheckoutSessionRequest=req.body;
     console.log(checkoutSessionRequest)
     const restaurant=await Restaurant.findById(
        checkoutSessionRequest.restaurantId
     );
     
     if(!restaurant){
        throw new Error("Restaurant not found");
     }

     const newOrder=new Order({
        restaurant:restaurant,
        user:req.userId,
        status:"placed",
        deliveryDetails:checkoutSessionRequest.deliveryDetails,
        cartItems:checkoutSessionRequest.cartItems,
        createdAt:new Date(),
     })
//for models (restaurants ,user ,...) type is figured by typescript ,for types embedded in models type has to me mentioned
    const lineItems=createLineItems(checkoutSessionRequest,restaurant.menuItems);//cartitems delivery price quantity
    //lineItems has to be sent to stripe
    const session=await createSession(lineItems,newOrder._id.toString(),
    restaurant.deliveryPrice,
    restaurant._id.toString(),
    );
    if(!session.url){
        return res.status(500).json({message:"Error creating stripe session"});
    }
    await newOrder.save();//saving after  checkout session is successful
    console.log(session.url);
    res.json({url:session.url});
    }catch(error:any){
         console.log(error);
         res.status(500).json({message:error.raw.message})
    };

  

};

export default{
    createCheckoutSession,stripeWebhookHandler,getMyOrders,
}