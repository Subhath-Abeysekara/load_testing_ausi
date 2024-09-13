import { url } from "inspector";
import { authenticate } from "./authentication/authenticate_token";
import {run_download , run_video} from "./connection_mongo";
import { auth_return, axio_post, download, user, video } from "./types";
import { ObjectId } from "mongodb";
import axios, { AxiosResponse } from "axios";

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
        console.log('video',video)
        const postData: axio_post = {
            url: video?.url,
            type:req.body.type
        };
        try {
          const axiosResponse: AxiosResponse<any> = await axios.post<any>(
              'http://3.110.132.203:3001/convert',
              postData,
              {
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  responseType: 'stream', 
              }
          );
          res.setHeader('Content-Type', `video/${req.body.type}`); 
          res.setHeader('Content-Disposition', 'inline'); 
          axiosResponse.data.pipe(res);
      
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Error occurred while sending video');
      }
    }
    }
    catch{
        res.send("error")
    }
}

export default operation