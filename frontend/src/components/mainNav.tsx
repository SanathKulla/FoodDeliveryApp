import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button"
import UsernameMenu from "./UsernameMenu";
import { Link } from "react-router-dom";

const MainNav=()=>{
    //isAuthenticated - login status of user(true or false)
    const {loginWithRedirect,isAuthenticated}=useAuth0();//a hook auth0 gives to redirect to login page on clicking login
    return (
        <span className="flex space-x-2 items-center">
             {isAuthenticated?
             <>
             <Link to="/" className="font-bold hover:text-orange-500 mr-2"> Home</Link>
             <Link to="/order-status" className="font-bold hover:text-orange-500 mr-2"> Order Status</Link>
             <UsernameMenu/>
             </>:
             <Button  variant="ghost" className="font-bold text-xl hover:text-orange-500 hover:bg-white"
        onClick={async ()=>await loginWithRedirect()}>
            Log In
        </Button>}
             </span>
        
    )
};

export default MainNav;