import { url } from "inspector";
import { authenticate } from "./authentication/authenticate_token";
import {run_download , run_video} from "./connection_mongo";
import { auth_return, download, user, video } from "./types";
import { ObjectId } from "mongodb";

const operation = async (req:any , res:any) => {
    try{
        let validity:auth_return = await authenticate(req , 1)
        console.log(validity)
        if (!validity.condition){
            res.send("not valid")
            return
        }
        else{
        let client = await run_download()
        const body:download= {
                user_id:validity.userId,
                video_id : req.body.video_id,
                time_stamp: Date.now().toString(),
                download_type:req.body.type
        }
        const data = await client.insertOne(body);
        client = await run_video()
        console.log(data);
        const video = await client.findOne({_id : new ObjectId(req.body.video_id)});
        return video
    }
    }
    catch{
        res.send("error")
    }
}

export default operation