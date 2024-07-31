//this page is put into authprovider to access useAuth

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useCreateMyUser } from "@/api/MyUserApi";
import { useNavigate } from "react-router-dom";

//hook that does not render the page if there is any change in the state
const AuthCallbackPage = () => {
  const hasCreatedUser=useRef(false);
  const {user}=useAuth0();
  const {createUser}=useCreateMyUser();
  const navigate=useNavigate();//used to navigate between pages
  //useEffect might render many times irrespective of dependency array to avoid that useRef is used

  useEffect(()=>{
  //hook that is called when page loads
  if(user?.sub && user?.email && !hasCreatedUser.current)//sub contains auth0Id
  {
    createUser({auth0Id:user.sub,email:user.email});//intializing call to backend
    hasCreatedUser.current=true;
    navigate("/");
  }
  },[navigate,user]);
  return <>Loading...</>
}

export default AuthCallbackPage