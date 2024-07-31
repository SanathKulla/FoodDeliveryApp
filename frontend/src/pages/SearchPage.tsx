import { useSearchRestaurant } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState={
   searchQuery:string;
   page:number;
   selectedCuisines:string[];
   sortOption:string;
}


const SearchPage = () => {
   const {city}=useParams();
   const [searchState,setSearchState]=useState<SearchState>({
      searchQuery:"",
      page:1,
      selectedCuisines:[],
      sortOption:"bestMatch",
   });

   const [isExpanded,setIsExpanded]=useState<boolean>(false);

   const setSortOption=(sortOption:string)=>{
      setSearchState((prevState)=>({
         ...prevState,
         sortOption,
         page:1,
      }))
   }
   const setSelectedCuisines=(selectedCuisines:string[])=>{
      setSearchState((prevState)=>({
         ...prevState,
         selectedCuisines,
         page:1,//or page:page
      }))
   }
   const {results,isLoading}=useSearchRestaurant(searchState,city);

   
    const setPage=(page:number)=>{ //page is passed by pagination component
      setSearchState((prevState)=>({
         ...prevState,
         page,//or page:page


      }));

    };
  const setSearchQuery=(searchFormData:SearchForm)=>{
   //if a function is passed to  set state of useState then we can access to prevState
    setSearchState((prevState)=>({
      ...prevState,// this is done to not to overwrite other values
      searchQuery:searchFormData.searchQuery,//updating searchQuery
      page:1,
    }))
  }
   const reset=()=>{
      setSearchState((prevState)=>({
         ...prevState,// this is done to not to overwrite other values
         searchQuery:"",//updating searchQuery
         page:1,
       }))
   }

   if(isLoading) return <span>Loading...</span>
   if(!results?.data || !city) {
     return <span>No results found</span>
   }
   


   return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5"> 
       {/* for larger screens no. of cols =2 1st -250px and 2nd takes all remaining space */}
       <div id="cuisines-list">
             <CuisineFilter selectedCuisines={searchState.selectedCuisines} onChange={setSelectedCuisines}
             isExpanded={isExpanded}
             onExpandedClick={()=>setIsExpanded((prevIsExpanded)=>!prevIsExpanded)}/>
       </div>
       <div id='main-content' className="flex flex-col gap-5">
         {/* searchQuery is used to persists the value user enters between each render .component re-renders whenever there is an update in search */}
         <SearchBar 
         searchQuery={searchState.searchQuery} 
         onSubmit={setSearchQuery} placeHolder="Search by cuisine or Restaurant Name"
         onReset={reset}/>

         <div className="flex justify-between flex-col gap-3 lg:flex-row">
         <SearchResultInfo total={results.pagination.total} city={city}/>
        <SortOptionDropdown sortOption={searchState.sortOption} onChange={(value)=>setSortOption(value)}>

        </SortOptionDropdown>

         </div>
        
        {results.data.map((restaurant)=>(
              <SearchResultCard restaurant={restaurant}/>
        ))}
   {/* page can be taken from states or result */}
        <PaginationSelector page={results.pagination.page}
        pages={results.pagination.pages}
        onPageChange={setPage} />
       </div>

    </div>
   )
} 
 
export default SearchPage