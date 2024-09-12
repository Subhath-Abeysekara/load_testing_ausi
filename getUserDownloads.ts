import { auth_return, return_, video } from "./types";
import { authenticate } from "./authentication/authenticate_token";
import {run_download} from "./connection_mongo"

const operation = async (req:any , res:any) => {
    try{
        const client = await run_download()
        let validity:auth_return = await authenticate(req , 1)
        console.log(validity)
        if (!validity.condition){
            res.send("not valid")
            return
        }
        else{
            const data_ = await client.find({ user_id: validity.userId }).toArray();
            console.log(data_);
            const response: return_={
                state:true,
                data:{
                    data_
                }
            }
            res.send(response)
        }
    }
    catch{
        console.log("catch")
        res.send("not valid")
        return
    }
}

export default operation