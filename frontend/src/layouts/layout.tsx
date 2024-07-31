import Header from "@/components/Header";
import BgImg from "@/components/bgImg";
import Footer from "@/pages/Footer";

// @ indicates root directory of project
type Props={
    children:React.ReactNode;
    showBgImg?:boolean; 
};
//whatever passed in the tags of layout is stored in children
const Layout=({children,showBgImg=false}:Props)=>{
    return(
        <div className="flex flex-col min-h-screen">
         <Header/>
         {showBgImg && <BgImg/>}
        <div className="container mx-auto flex-1 py-10">{children}</div>
        <Footer/>
        </div>
    )
}

export default Layout;