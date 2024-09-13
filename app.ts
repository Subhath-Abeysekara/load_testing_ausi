import express from 'express';
import { Response } from 'express';
import multer from 'multer';
import cors from 'cors'
import bodyParser from "body-parser";
import register_user from './register_user';
import login_user from './login_user';
import addVideo from './addVideo'
import getUserDownloads from './getUserDownloads'
import getUserVideos from './getUserVideos'
import convertvideo from './convertVideo'
import { auth_return, axio_post, return_ } from './types';
import { authenticate } from './authentication/authenticate_token';
import path from 'path';
import fs from 'fs';
import getVideoName from './getVideoName';
import axios, { AxiosResponse } from 'axios';
// const __filename = "D:\Projects\Load_testing_ausi\app.ts"
const dirname = "D:/Projects/Load_testing_ausi";
const app: express.Application = express();
const port: number = 3000;
app.use(cors())
app.use(bodyParser.json())


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(dirname, 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname)
      cb(null, `${req.body.name}${extension}`);
    }
  });

  const fileFilter = (req: any, file: any, cb: (arg0: null, arg1: boolean) => void) => {
    cb(null, true);
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
  });


app.get('/', (_req, _res) => {
    console.log(_req.params)
    _res.send("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>");
});

app.post('/login', (_req , _res) => {
    login_user(_req , _res)
});

app.post('/register', (_req, _res) => {
    register_user(_req , _res)
});

app.get('/auth_api',async (_req, _res) => {
    try{
        let validity:auth_return = await authenticate(_req , 1)
        console.log(validity)
        if (!validity.condition){
            _res.send("not valid")
            return
        }
        else{
            _res.send("valid")
        }
    }
    catch{
        console.log("catch")
        _res.send("not valid")
        return
    }
});

app.get('/user/get_video_name', (_req, _res) => {
    getVideoName(_req , _res)
});

app.post('/upload', (req, res, next) => {
    addVideo(req , res)
    next();
  }, upload.single('file'), (req, res) => {
    console.log("API working");
    if (!req.file) {
      return res.status(400).send('No file uploaded or invalid file type.');
    }
    console.log(req.file);
    res.send(`File uploaded successfully: ${req.file.filename}`);
  });

app.get('/user/get_videos', (_req, _res) => {
    getUserVideos(_req , _res)
});

app.post('/convert', async (_req, _res) => {
    const x:any = convertvideo(_req , _res)
    console.log(x)
    const postData: axio_post = {
      url: '1726121432412-output_audio.wav'
  };
  try {
    const axiosResponse: AxiosResponse<any> = await axios.post<any>(
        'http://3.110.132.203:3001/convert', // Replace with your API endpoint
        postData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'stream',  // Ensure we get the response as a stream
        }
    );

    // Set headers for video response
    _res.setHeader('Content-Type', 'video/mp4');  // Adjust if the video is of a different format
    _res.setHeader('Content-Disposition', 'inline');  // inline will allow browser to play the video

    // Pipe the video stream from the Axios response to the client
    axiosResponse.data.pipe(_res);

} catch (error) {
    console.error('Error:', error);
    _res.status(500).send('Error occurred while sending video');
}
});

app.get('/user/get_downloads', (_req, _res) => {
    getUserDownloads(_req , _res)
});

app.listen(port,async () => {
        console.log(`TypeScript with Express
         http://localhost:${port}/`);
});
