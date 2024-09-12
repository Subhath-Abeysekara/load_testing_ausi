import {run_user} from "./connection_mongo";
import { user } from "./types";

const operation = async (req:any , res:any) => {
    try{
        const client = await run_user()
        const data_ = await client.findOne({'email':req.body.email});
        console.log(data_);
        if(data_ != null){
            res.send("Alredy Registered")
        }
        else{
            const body:user= {
                name:req.body.name,
                email : req.body.email,
                password : req.body.password,
                video_no:0
            }
            const data = await client.insertOne(body);
            console.log(data);
            res.send("success")
        }
    }
    catch{
        res.send("error")
    }
}

export default operation