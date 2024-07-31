import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react";


const MobileNavLinks = () => {
    const {logout} =useAuth0();
  return (
    <>
    <Link to="/order-status " className="flex font-bold text-xl hover:text-orange-500 justify-center" >Order Status</Link>
    <Link to="/userprofile " className="flex font-bold text-xl hover:text-orange-500 justify-center" >user profile</Link>
    <Link to="/manage-restaurant " className="flex font-bold text-xl hover:text-orange-500 justify-center" >Manage Restaurant </Link>
    <Button 
    className="flex text-bold text-xl text-white bg-orange-500 "
    onClick={()=>logout()}>Log Out</Button>
    </>
  )
}

export default MobileNavLinks