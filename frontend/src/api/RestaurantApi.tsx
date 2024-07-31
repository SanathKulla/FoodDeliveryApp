import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant=(restaurantId?:string)=>{
     const getRestaurantByIdRequest=async():Promise<Restaurant>=>{
        const response=await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}`);
        if(!response.ok){
            throw new Error("Failed to get restaurant");
        }
        return response.json();

     }
     const {data:restaurant,isLoading}=useQuery("fetchRestaurant",getRestaurantByIdRequest,{enabled:!!restaurantId});
     return {restaurant,isLoading};
}
export const useSearchRestaurant=(searchState:SearchState,city?:string)=>{
     //to add queries to  api URLSearchParams() is used
       const params=new URLSearchParams();
        params.set("searchQuery",searchState.searchQuery)
        params.set("page",searchState.page.toString());
        params.set("selectedCuisines",searchState.selectedCuisines.join(","));
        params.set("sortOption",searchState.sortOption);
        const createSearchRequest=async ():Promise<RestaurantSearchResponse>=>{
            const response=await fetch(`${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`);//passing search query as queries

            if(!response.ok){
                throw new Error("Failed to get restaurant");
            }
            return response.json();
        };

        const {data:results,isLoading}=useQuery(["searchRestaurants",searchState],createSearchRequest,{enabled:!!city});//last obj is to ensure that query runs iff city is not null
        //second value in array passed in useQuery states that whenever it changes usequery has to run again i.e fetching has to done
        return {results,isLoading}; 
}