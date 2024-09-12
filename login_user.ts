import { issue_token } from "./authentication/generate_token";
import {run_user} from "./connection_mongo";
import { return_, token_body } from "./types";

const operation = async (req : any , res : any) => {
    const client = await run_user()
    const data = await client.findOne({'email':req.body.email});
    console.log(data);
    if(data != null && data.password === req.body.password){
        const token_body:token_body={
            userId:data._id.toString(),
            userType:"user",
            email:req.body.email
        }
        const token = issue_token(token_body)
        const response:return_={
            state:true,
            data:{
                token:token,
                userType:"user"
            }
        } 
        res.send(response)
    }
    else{
        res.send("error username or password")
    }
    // await client.close();
}

export default operation