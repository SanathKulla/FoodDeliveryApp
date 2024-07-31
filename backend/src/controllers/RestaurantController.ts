import {Request,Response} from "express";
import Restaurant from "../models/restaurant";


const getRestaurant=async(req:Request,res:Response)=>{
        try{
            const restaurantId=req.params.restaurantId;
            const restaurant=await Restaurant.findById(restaurantId)
            if(!restaurant){
              return res.status(404).json({message:"restaurant not found"});
            }
            res.json(restaurant);
        }catch(error){
          console.log(error);
    return res.status(500).json({message:"something went wrong"})
        }
}
const searchRestaurant=async (req:Request,res:Response)=>{
  // console.log(req.query)
  try{
    const city=req.params.city;
    //search is sent as search query in req to backend
    //searchQuery is optional
    const searchQuery=(req.query.searchQuery as string) ||"";
   const selectedCuisines=req.query.selectedCuisines as string ||"";//an array separated with ,
   const sortOption =req.query.sortOption as string || "lastUpdated";
     const page=parseInt(req.query.page as string) ||1; //no. of pages of response

     let query:any={};//any type is used if type is complicated or multiple type may be considered
    //check if any restaurant availabe in the city if not return

    query["city"]=new RegExp(city,"i");//go and get me all restaurant with city field matches given city (case insensitive -i) 
    const cityCheck=await Restaurant.countDocuments(query); //returns a no.         
                                                                                                                                     
    if(cityCheck===0){
        return res.status(404).json({
            data:[],
            pagination:{
                total:0,
                page:1,
                pages:1,
            },
        });//frontend excepts an array
    } 
   
  if(selectedCuisines){
    const cuisinesArray=selectedCuisines.split(",").map((cuisine)=>new RegExp(cuisine,"i"));
    query["cuisines"]={$all:cuisinesArray};//finding all restaurants where cuisines array contains all items that we received in req
  }
    
if(searchQuery){
    //restaurantName=pizza place
    //cuisines=[pizza,pasta]
    //searchQuery =pasta
    const searchRegex=new RegExp(searchQuery,"i");
    //or statement is added to query ,for each restaurant name in docs search for restaurant name or check or any of the cuisine
    query["$or"]=[
        {
            restaurantName:searchRegex
        },
        {
            cuisines:{$in:[searchRegex]} // any of the cuisines array for any matches (not all match)
        },
    ]
  }
    const pageSize=10;
    const skip=(page-1)*pageSize;//how many records has to be skipped  based on page size to get the result
    const restaurants=await Restaurant.find(query).sort({[sortOption]:1}).skip(skip).limit(pageSize).lean();//lean strips out all mongoose ids and meta data and return js obj 
     //as sortOption is dynamically selected so it is placed in array
    const total=await Restaurant.countDocuments(query)
    
    //pagination and data has to be returned

    const response={
        data:restaurants,
        pagination:{
            total,//50
            page,//current page
            pages:Math.ceil(total/pageSize),//  (50/10) =5
        }
    }; 
    res.json(response);

  }catch(error){
    console.log(error);
    return res.status(500).json({message:"something went wrong"})
  }
}

export default {
    searchRestaurant,getRestaurant
}