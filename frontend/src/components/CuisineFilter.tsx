import { cuisineList } from "@/config/restaurant-options-config";
import { Label } from "@radix-ui/react-label";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { ChangeEvent } from "react";
import { Button } from "./ui/button";

type Props={
    onChange:(cuisines:string[]) =>void;
    selectedCuisines:string[];
    isExpanded:boolean;
    onExpandedClick:()=>void;
};

const CuisineFilter = ({onChange,selectedCuisines,isExpanded,onExpandedClick}:Props) => {
    
const handleCuisinesReset=()=>onChange([]);//new array of selected cuisines is passed
//as we are dealing with checkboxes , an event is sent when it is clicked
const handleCuisinesChange=(event:ChangeEvent<HTMLInputElement>)=>{
    const clickedCuisine=event.target.value;//value is added to input field
    //we can know clicked cuisine
    const isChecked=event.target.checked;
    const newCuisinesList=isChecked? [...selectedCuisines,clickedCuisine]:selectedCuisines.filter((cuisine)=>cuisine!==clickedCuisine);

    onChange(newCuisinesList);

};
  return (
    <>
    <div className="flex justify-between items-center px-2">
        <div className="text-md font-semibodl mb-2">Filter By Cuisine</div>
         <div onClick={handleCuisinesReset}className="text-sm font-semibold mb-2 underline cursor-pointer text-blue-500">Reset Filters</div>
    </div>
    <div className="space-y-2 flex flex-col">
        {cuisineList.slice(0,isExpanded ? cuisineList.length : 7).map((cuisine)=>{
            const isSelected=selectedCuisines.includes(cuisine);

            return <div className="flex">
                    <input id={`cuisine_${cuisine}`} type="checkbox" className="hidden" value={cuisine} checked={isSelected} onChange={handleCuisinesChange}/>
                    <Label htmlFor={`cuisine_${cuisine}`} className={`flex flex-1 items-center px-4  cursor-pointer text-sm rounded-full font-semibold py-2 ${isSelected ? "border border-grren-600 text-green-600" : "border border-slate-300"}`}>
                        {isSelected && <Check size={20} strokeWidth={3}/>}
                        {cuisine}
                    </Label>
                    {/* linking label to input based on id */}
                </div>
        })}
        <Button variant="link"  onClick={onExpandedClick} className="mt-4 flex-1">
            {isExpanded ? (<span className="flex flex-row items-center">View Less <ChevronUp/></span>):<span className="flex flex-row items-center"> View More <ChevronDown/></span>}
        </Button>
    </div>
    </>
  )
}

export default CuisineFilter

