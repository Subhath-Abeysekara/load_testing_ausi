import express from 'express';
import multer from 'multer';
import cors from 'cors'
import bodyParser from "body-parser";
import register_user from './register_user';
import login_user from './login_user';
import addVideo from './addVideo'
import getUserDownloads from './getUserDownloads'
import getUserVideos from './getUserVideos'
import convertvideo from './convertVideo'
import { auth_return, return_ } from './types';
import { authenticate } from './authentication/authenticate_token';
import Multer from 'multer';
import path from 'path';
import fs from 'fs';
import getVideoName from './getVideoName';
import ffmpeg from 'fluent-ffmpeg';
import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
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

  const convertVideo = (inputPath:any, outputPath: unknown) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err: any) => reject(err))
        .run();
    });
  };

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
    const inputVideoPath = path.join(__dirname,'uploads', x.url); // Input uploaded file path
    const convert_name = `${Date.now()}-converted.mp4`
    const outputVideoPath = path.join(__dirname, 'uploads', convert_name); // Output converted video path
    try {
      const convertedVideo = await convertVideo(inputVideoPath, outputVideoPath);
      const videoPath = path.join(__dirname,'uploads', convert_name);
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const range = _req.headers.range;

  if (range) {
    // Handle range requests for video streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    _res.writeHead(206, head); // Partial Content
    file.pipe(_res);
  } else {
    // If no range header, send the entire video
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    _res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(_res);
  }
      // res.send(`Video uploaded and converted successfully: ${convertedVideo}`);
    } catch (err:any) {
      _res.status(500).send(`Error converting video: ${err.message}`);
    }
    const response: return_={
        state:true,
        data:{
            x
        }
    }
    _res.send(response)
});

app.get('/user/get_downloads', (_req, _res) => {
    getUserDownloads(_req , _res)
});

app.listen(port,async () => {
        console.log(`TypeScript with Express
         http://localhost:${port}/`);
});
