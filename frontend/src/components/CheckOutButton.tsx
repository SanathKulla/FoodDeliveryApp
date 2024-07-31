import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
// import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props={
    onCheckout:(userFormData:UserFormData)=>void;
    disabled:boolean;//parent can disable checkout button depending on logic 
    isLoading:boolean;
};

const CheckOutButton = ({onCheckout,disabled,isLoading}:Props) => {
    const {isAuthenticated,isLoading:isAuthLoading,loginWithRedirect}=useAuth0();
    const {pathname}=useLocation();//it is used to store cuurent path and redirect user to it after logging in

    const {currentUser,isLoading:isGetUserLoading}=useGetMyUser();
  
    const onLogin=async ()=>{
        await loginWithRedirect({
            appState:{
                returnTo:pathname,
            },
        })
    }
    if(!isAuthenticated){
     return <Button className="bg-orange-500 flex-1" onClick={onLogin}>Log in to check out</Button>
   }
   if(isAuthLoading  || !currentUser || isLoading){
    return <LoadingButton />
   }
   //asChild any component that is added in Dialog Trigger opens up the dialog
   return (
    <Dialog>
        <DialogTrigger asChild>
            <Button disabled={disabled} className="bg-orange-500 flex-1">Go to checkout</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
            <UserProfileForm 
            onSave={onCheckout}
             isLoading={isGetUserLoading}
             currentUser={currentUser} 
             title={"Confirm Delivery Details"}
             buttonText="Continue to payment"/>
        </DialogContent>
    </Dialog>
   )
  
}

export default CheckOutButton