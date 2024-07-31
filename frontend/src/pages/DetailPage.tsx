import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItems";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Card, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {MenuItem as MenuItemType} from "../types"
import CheckOutButton from "@/components/CheckOutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";

export type CartItem={
   _id:string;
   name:string;
   price:number;
   quantity:number;
};
const DetailPage = () => {
   const {restaurantId}=useParams();//as restaurant id is obtained from useParams() it may be undefined so it has to be handled
   //it is handled by adding enabled in use query of useGetRestaurant hook
   const {restaurant,isLoading}=useGetRestaurant(restaurantId);
   const {createCheckoutSession,isLoading:isCheckOutLoading}=useCreateCheckoutSession();
   //retriving the cart on loading page
   const [cartItems,setCartItems]=useState<CartItem[]>(()=>{
      const storedCartItems=sessionStorage.getItem(`cartItems-${restaurantId}`);
      return storedCartItems?JSON.parse( storedCartItems):[]; 

   })

   const removeFromCart=(cartItem:CartItem)=>{
        setCartItems((prevCartItems)=>{
             const updatedCartItems=prevCartItems.filter((item)=>cartItem._id!==item._id);
             sessionStorage.setItem(`cartItems-${restaurantId}`,
             JSON.stringify(updatedCartItems));
             return updatedCartItems;
        })
   }
   const addToCart=(menuItem:MenuItemType)=>{
      setCartItems((prevCartItems)=>{
            //check if item is already in cart
            const existingCartItem=prevCartItems.find(
               (cartItem)=>cartItem._id===menuItem._id
            );
           let updatedCartItems;
            if(existingCartItem){
               //update quantity
               //to update a property in an  array map fn is used
               updatedCartItems=prevCartItems.map((cartItem)=>cartItem._id===menuItem._id? {...cartItem,quantity:cartItem.quantity+1}:cartItem)

            }
            else{
               updatedCartItems=[
                  ...prevCartItems,{
                     _id:menuItem._id,
                     name:menuItem.name,
                     price:menuItem.price,
                     quantity:1,

                  }
               ];
            }
           //cart items are stored in state items and they get reloaded when app loads that removes cart data
           //sessionStorage of browser is used to store cartItems 
            sessionStorage.setItem(`cartItems-${restaurantId}`,
            JSON.stringify(updatedCartItems));//1st one is key
            //it stores until the system is on 
            //if present update quantity
            //if not add it as a new item
        return updatedCartItems;//sets the state
      })
   } 
   if(isLoading || !restaurant){
    return "Loading...";
   }
   

   const onCheckout= async (userFormData:UserFormData)=>{
   console.log("userFormData",userFormData);
   if(!restaurant) return ;
   const checkoutData={
      cartItems:cartItems.map((cartItem)=>({
         menuItemId:cartItem._id,
         name:cartItem.name,
         quantity:cartItem.quantity.toString(),
      })),
       restaurantId:restaurant._id,
       deliveryDetails:{
         name:userFormData.name,
         addressLine1:userFormData.addressLine1,
         city:userFormData.city,
         country:userFormData.country,
         email:userFormData.email as string,
       },
   };
  const data=await  createCheckoutSession(checkoutData);
  window.location.href=data.url; //sending user to url sent from stripe
   }

   return (
    <div className="flex flex-col gap-10 ">
         <AspectRatio ratio={16/5}>
            <img src={restaurant.imageUrl} className="rounded-md object-fill m-auto h-full w-[75%]"/>
         </AspectRatio>
         <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
            <div className="flex flex-col gap-4">
               <RestaurantInfo restaurant={restaurant}/>
               <span className="text-2xl font-bold tracking-tight">Menu</span>
               {restaurant.menuItems.map((menuItem)=>(
                  <MenuItem menuItem={menuItem} addToCart={()=>addToCart(menuItem)}/>
               ))}
            </div>
            <div>
               <Card>
                  <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart}/>
                  <CardFooter>
                     <CheckOutButton isLoading ={isCheckOutLoading} disabled={cartItems.length===0} onCheckout={onCheckout}/>
                  </CardFooter>
               </Card>
            </div>
         </div>
    </div>
   )
}

export default DetailPage