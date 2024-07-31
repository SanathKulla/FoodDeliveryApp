import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {  useForm } from "react-hook-form";
import {z} from "zod";

const formSchema=z.object({
    //properties of form
    email:z.string().optional(),
    name:z.string().min(1,"name is required"),
    addressLine1:z.string().min(1,"AddressLine 1 is required"),
    city:z.string().min(1,"city is required"),
    country:z.string().min(1,"country is required"),
});
//zod framework is going to automatically detect property and type based on defined schema
export type UserFormData=z.infer<typeof formSchema>

type Props={
    onSave:(userProfileData: UserFormData)=> void;
    isLoading:boolean;
    currentUser:User;
    title?:string;
    buttonText?:string;
} 
//form field is a controlled component so default value has to be provided for each field
const UserProfileForm=({onSave,isLoading,currentUser,title="User Profile",buttonText="Submit"}:Props)=>{
    const form=useForm<UserFormData>({
        resolver:zodResolver(formSchema),//tp handle validation 
        defaultValues:currentUser,

    });
 
    useEffect(()=>{ //console.log(currentUser)
        form.reset(currentUser);
    },[currentUser,form])
//...form - (copying) linking form to component Form
//handleSubmit -fn comes from (form above -react hook lib)
//it runs validation and onSave method is called if valid and passes form data to it
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-gray-50 rounded-lg md:p-10">
              <div>
              <h2 className="text-2xl font-bold">
                {title}
              </h2>
              <FormDescription>
                 view and change your profile information here 
              </FormDescription>
              </div>
              {/* //  ...field has info about state of input(error,user access etc ) -spreading those properties to input
            //formcontrol wraps input to help us display errors ,etc */}
            <FormField control={form.control} 
               name= "email" 
              render={({field})=>(
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input {...field} disabled className="bg-white"/>
                    </FormControl>
                </FormItem>
            )}
            />

            <FormField control={form.control} 
               name= "name" 
              render={({field})=>(
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field}  className="bg-white"/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

            <div className="flex flex-col md:flex-row gap-4">
            <FormField control={form.control} 
               name= "addressLine1" 
              render={({field})=>(
                <FormItem className="flex-1">
                    <FormLabel>Address Line 1 </FormLabel>
                    <FormControl>
                        <Input {...field}  className="bg-white"/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                
            )}
            />

             <FormField control={form.control} 
               name= "city" 
              render={({field})=>(
                <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input {...field}  className="bg-white"/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

            <FormField control={form.control} 
               name="country" 
               render={({field})=>{ //console.log(field)
              return ( <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input {...field}  className="bg-white"/>
                    </FormControl>
                    <FormMessage/>
                </FormItem> )
              }}
            />
            </div>
             {isLoading ? <LoadingButton/>:(<Button type="submit" className="bg-orange-500">{buttonText}</Button>)}



            </form>
        </Form>
    )
};

export default UserProfileForm;