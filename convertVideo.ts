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
          function isPrime(num:any) {
            if (num <= 1) return false;
            if (num <= 3) return true;
            
            if (num % 2 === 0 || num % 3 === 0) return false;
            
            for (let i = 5; i * i <= num; i += 6) {
              if (num % i === 0 || num % (i + 2) === 0) return false;
            }
            
            return true;
          }

          function loadCPU(limit:any) {
            let primeCount = 0;
            
            for (let i = 2; i < limit; i++) {
              if (isPrime(i)) {
                primeCount++;
              }
            }
            
            console.log(`Found ${primeCount} prime numbers up to ${limit}.`);
          }
          const limit = 100000;
            console.log("Starting CPU loading operation...");
            loadCPU(limit);
          res.setHeader('Content-Type', `video/${req.body.type}`); 
          res.setHeader('Content-Disposition', 'inline'); 
          axiosResponse.data.pipe(res);
      
      } catch (error) {
        function isPrime(num:any) {
            if (num <= 1) return false;
            if (num <= 3) return true;
            
            if (num % 2 === 0 || num % 3 === 0) return false;
            
            for (let i = 5; i * i <= num; i += 6) {
              if (num % i === 0 || num % (i + 2) === 0) return false;
            }
            
            return true;
          }

          function loadCPU(limit:any) {
            let primeCount = 0;
            
            for (let i = 2; i < limit; i++) {
              if (isPrime(i)) {
                primeCount++;
              }
            }
            
            console.log(`Found ${primeCount} prime numbers up to ${limit}.`);
          }
          const limit = 100000;
            console.log("Starting CPU loading operation...");
            loadCPU(limit);
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