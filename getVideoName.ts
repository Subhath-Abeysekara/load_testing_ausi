import { auth_return, return_, user, video } from "./types";
import { authenticate } from "./authentication/authenticate_token";

const operation = async (req:any , res:any) => {
    try{
        let validity:auth_return = await authenticate(req , 1)
        console.log(validity)
        if (!validity.condition){
            res.send("not valid")
            return
        }
        else{
            const response: return_={
                state:true,
                data:{
                    video_name:`${validity.userId}_${Date.now()}`
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