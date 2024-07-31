import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";


const MenuSection = () => {
  const {control}=useFormContext();
  //it is difficult to add menu and delete  from an array normally instead field array component is used fieldarray 

  const {fields,append,remove}=useFieldArray({//fields array of menu items
    control,
    name:"menuItems",//to manage fieldarray
  });
  return (
    <div className="space-y-2">
        <div>
            <h2 className="text-2xl font-bold">
                 Menu
            </h2>
            <FormDescription> 
                Create your menu and give each item a name and a Price
            </FormDescription>
        </div>
        <FormField control={control} name="menuItems" render={()=>(
            <FormItem className="flex flex-col gap-2">
                {fields.map((_,index)=>(
                     <MenuItemInput index={index} removeMenuItem={()=> remove(index)} />
                ))}
            </FormItem>
  )}/>

<Button type="button" onClick={()=>append({name:"",price:""})}>
    Add Menu Item
</Button>
    </div>
  )

}

export default MenuSection 