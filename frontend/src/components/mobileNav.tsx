import { Separator } from "./ui/separator";
import {Sheet,SheetTrigger,SheetDescription,SheetTitle,SheetContent} from "./ui/sheet";
import { CircleUserRound, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";
const MobileNav=()=>{
    const {loginWithRedirect,isAuthenticated,user}=useAuth0();
    return(
        <Sheet>
            <SheetTrigger>
             <Menu className="text-orange-500"/>
            </SheetTrigger>
            <SheetContent className="space-y-3">
                <SheetTitle className=" ">
                    {isAuthenticated?
                    <span className="flex gap-2 text-xl items-center justify-center"><CircleUserRound className="text-orange-500"/>
                    {user?.name}
                    </span>
                    :<span className="tracking-wide">Welcome to Taste Hub</span> }
                     
                </SheetTitle>
                <Separator />
                <SheetDescription className="flex flex-col gap-3  ">
                    {isAuthenticated?<MobileNavLinks/>:
                    <Button
                     className="flex-1 text-xl bg-orange-500 font-bold"
                      onClick={async()=> await loginWithRedirect()}>
                        Log In</Button>
                  }
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav;


