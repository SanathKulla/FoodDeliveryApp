import { CardContent, CardHeader, CardTitle } from "./ui/card"
import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";


type Props={
     restaurant:Restaurant;
     cartItems:CartItem[];
     removeFromCart:(cartItem:CartItem)=> void;
 }

const OrderSummary=({restaurant,cartItems,removeFromCart}:Props)=>{
    const getTotalCost=()=>{
        //it iterates over an aray and for each item it gets cost and quantity of all items in cartItems and adds it to total
       const totalInPaisa=cartItems.reduce((total,cartItem)=> total+cartItem.price*cartItem.quantity,0);
       //outcome of first arguement gets passed to total variable ,which is passed on to next cartITem
        //overall result gets stored in totalInRupees variable
        //0 is initial value of total

        const totalWithDelivery=totalInPaisa +restaurant.deliveryPrice
        return (totalWithDelivery/100).toFixed(2);
    }
    
  return (
     <>
     <CardHeader>
         <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
              <span>Your Order</span>
              <span>${getTotalCost()}</span>
         </CardTitle>
     </CardHeader>
     <CardContent className="flex gap-5 flex-col">
         {cartItems.map((item)=>(
            <div className="flex justify-between">
                <span>
                    <Badge variant="outline" className="mr-2">
                          {item.quantity}
                    </Badge>
                     {item.name}
                </span>
                <span className="flex items-center gap-1">
                    <Trash className="cursor-pointer" color="red" size={20} onClick={()=>removeFromCart(item)}/>
                    ${((item.price*item.quantity)/100).toFixed(2)}
                </span>
            </div>
         ))}
         <Separator/>
          <div className="flex justify-between ">
            <span>Delivery</span>
            <span>${((restaurant.deliveryPrice)/100).toFixed(2)}</span>
          </div>
          <Separator/>
     </CardContent>
     </>
  )
};


export default OrderSummary