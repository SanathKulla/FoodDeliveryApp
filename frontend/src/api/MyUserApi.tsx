import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

//contains all hooks to interact with user api
const API_BASE_URL= import.meta.env.VITE_API_BASE_URL;


export const useGetMyUser=()=>{
    const  {getAccessTokenSilently}=useAuth0(); 
    const getMyUserRequest=async ():Promise<User>=>{
        const accessToken=await getAccessTokenSilently();
        
        const response=await fetch(`${API_BASE_URL}/api/my/user`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type":"application/json",
            }
        });
   
        if(!response.ok){
            throw new Error("Failed to Fetch User..");
        }

        return response.json();
    };
    const {data:currentUser,isLoading,error}=useQuery("fetchCurrentUser",getMyUserRequest);//to fetch data usequery hook is used

    if(error){ 
        toast.error(error.toString());
    }

    return {currentUser,isLoading};
}
type  CreateUserRequest={
    //describe properties needed in the req body
    auth0Id:String,
    email:String,

};
//token is used to ensure that user info is entered in db only after login 
//hook that users use to call an endpoint
export const useCreateMyUser=()=>{
    const {getAccessTokenSilently}=useAuth0(); //getting a fn that lets us fetch tokens of users from auth0 server using hook
    const createMyUserRequest=async (user:CreateUserRequest)=>{
        const accessToken=await getAccessTokenSilently();
        
        const response=await fetch(`${API_BASE_URL}/api/my/user`, {
        method:"POST",
        headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":"application/json",//tells backend what type of body of req should be accepted

        },
        body:JSON.stringify(user),

        });//OPTIONS PASSING TO FETCH

        if(!response.ok){
            throw new Error("Failed to create user");
        }
    }; 

    const {mutateAsync:createUser,isLoading,isError,isSuccess}=useMutation(createMyUserRequest);//passing fetch request to hook

    return {
        createUser,
        isLoading,
        isError,
        isSuccess,
    };//returning from custom hook the  things useMutation hooks provides for other components to access 
};


type UpdateMyUserRequest={
    name:string;
    addressLine1:string,
    city:string,
    country:string,
}
//hook to update user info
export const useUpdateMyUser=()=>{
    const {getAccessTokenSilently}=useAuth0();
    const updateMyUserRequest=async (formData:UpdateMyUserRequest)=>{ 
        const accessToken=await getAccessTokenSilently();
      const response=await fetch(`${API_BASE_URL}/api/my/user`,{
        method:"PUT",
        headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":"application/json",
        },
        body:JSON.stringify(formData),
      });

      if(!response.ok){
        throw new Error("Failed to update user  ")
      }
      return response.json();
    };

    const {mutateAsync: updateUser,isLoading,isSuccess,error,reset}=useMutation(updateMyUserRequest);
    
    if(isSuccess){
        toast.success("User profile updated!");
    }
    if(error){
        toast.error(error.toString());
        reset();
    }
    return {
        updateUser,
        isLoading,
    }
}