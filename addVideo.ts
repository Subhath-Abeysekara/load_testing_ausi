import { authenticate } from "./authentication/authenticate_token";
import {run_video} from "./connection_mongo";
import { auth_return, user, video } from "./types";

const operation = async (req:any , res:any) => {
    try{
        let validity:auth_return = await authenticate(req , 1)
        console.log(validity)
        if (!validity.condition){
            res.send("not valid")
            return
        }
        else{
        const client = await run_video()
        const body:video= {
                user_id:validity.userId,
                url : req.body.name,
                title:req.body.title
        }
        const data = await client.insertOne(body);
        console.log(data);
    }
    }
    catch{
        res.send("error")
    }
}

export default operation