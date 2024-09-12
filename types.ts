import { type } from "os";

export type user={
    name:string,
    email:string,
    password:string,
    video_no:number
}

export type video={
    user_id:string,
    url:string
}

export type download={
    video_id:string,
    download_type:string,
    time_stamp:string,
    user_id:string
}

export type token_body={
    userType:string,
    email:string,
    userId:string
}

export type return_= {
    state:boolean,
    data?:object
}

export type api_auth = {
    api_no:number,
    type:string
}

export type auth_res = {
    status : string,
    token?:any
    verified:boolean,
    massage:string

}

export type auth_return={
    userId:string,
    condition:boolean
}