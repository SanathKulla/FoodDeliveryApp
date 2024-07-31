// import {  } from "@radix-ui/react-dropdown-menu"
import { CircleUserRound } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import { Separator } from "./ui/separator"


const UsernameMenu = () => {
    const {user,logout}=useAuth0();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-3 hover:text-orange-500  gap-2 font-bold text-xl" >
           <CircleUserRound className="text-orange-500"/>
           {user?.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                
                <Link to="/userprofile" className="font-bold  hover:text-orange-500">User Profile</Link>
            </DropdownMenuItem>
            <Separator/>
            <DropdownMenuItem>
                <Link to="/manage-restaurant" className="font-bold  hover:text-orange-500">My Restaurant</Link>
            </DropdownMenuItem>
            <Separator/>
            <DropdownMenuItem>
                <Button 
                className="flex flex-1 font-bold bg-orange-500"
                onClick={()=>logout()}
                >Log Out</Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UsernameMenu