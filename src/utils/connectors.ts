import axios from 'axios'
import * as dotenv from "dotenv";
import { throwDeprecation } from 'process';

dotenv.config()
const dbUrl:any=process.env.DB_URL

interface filter{
    [key:string]:any;
}
interface data{
    [key:string]:any;

}
interface query{
    [key:string]:any;

}

export const controllerService={
    find:async(model:string,filter:filter={})=>{
        try {

            const result=await axios.post(dbUrl+'/findAll',{model:model,filter:filter})
            return result?.data||null
        } catch (error:any) {
            console.error("Error in find:",error.message||error)
            throw new Error("Unable to retrieve data")
        }
    },
    findOne:async(model:string,filter:filter)=>{
        try {
            const result=await axios.post(dbUrl+'/findOne',{model:model,filter:filter})
            return result?.data||null
            
        } catch (error:any) {
            console.error("Error in FindOne:",error.message||error)
            throw new Error("unable to retrieve data")

            
        }
    },
    create:async(model:string,data:data)=>{
        try {
            const result=await axios.post(dbUrl+'/create',{model:model,data:data})
            return result?.data||null
            
        } catch (error:any) {
            console.error("Error in creating :",error.message||error)
            throw new Error("unable to retrieve data")
            
        }
    },
    deleteOne:async(model:string,filter:filter)=>{
        try {
            const result =await  axios.post (dbUrl+'/deleteOne',{model:model,filter:filter})
            return result?.data||null
        } catch (error:any) {
            console.error("Error in deleteOne:",error.message||error)
            throw new Error("unable to retrieve data")
            
        }
    },
    updateOne:async(model:string,filter:filter,data:data)=>{
        try {
            const result=await axios.post(dbUrl+'/updateOne',{model:model,filter:filter,data:data})
            return result?.data||null
        } catch (error:any) {
            console.error("Error in updateOne:",error.message||error)
            throw new Error("Unable to retrieve data")
            
        }
    },
    aggregate:async(model:string,query:query)=>{
        try {
            const result=await axios.post(dbUrl+'/records',{
                model,query
            })
            console.log(result)
            return result?.data||null
        } catch (error:any) {
            console.error("Error in aggregate:",error.message||error)
            
        }
    }
}
