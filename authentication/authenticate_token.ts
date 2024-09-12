import jwt from 'jsonwebtoken'
import { api_auth, auth_res, auth_return, return_ } from '../types'
import { promises } from 'dns'

const obj ={
    'api_access_list' : [
        {
            'api_no' : 1,
            'user_types' : ['user']
        }
    ]
}

async function check_authorization(api_auth:api_auth){
    var value = false
    console.log(api_auth.api_no)
    const availability = new Promise((resolve) => {
        var newArray = obj.api_access_list.filter(function (el)
    { 
        if(el.api_no == api_auth.api_no ){
            resolve(el.user_types.includes(api_auth.type) ) 
            value = el.user_types.includes(api_auth.type)
            return      
        }
    }
    );
    })
    return value 
}

async function getDecode(req:any):Promise<auth_res>{
    let tokenHeaderKey = "token";
    let jwtSecretKey = "njkgsdjgflskfmmfhskfkmfbffkdffmk";
    const response:Promise<auth_res> = new Promise((resolve) =>{
        try {
            const token = req.header(tokenHeaderKey);
            console.log("token",token)
            if (token == null){
                const response:auth_res = {
                    "status" : "error",
                    "massage" : "no header token",
                    "verified": false
                }
                resolve(response)
            }
        const verified = jwt.verify(token , jwtSecretKey)
        console.log("verified_data",verified)
        console.log(jwt.decode(token))
        if(verified){
            const response:auth_res = {
                "status" : "success",
                "massage" : "verified",
                "verified": true,
                "token" : jwt.decode(token)
            }
            resolve(response);
        }else{
            console.log("error")
            const response:auth_res = {
                "status" : "error",
                "massage" : "not verified",
                "verified": false
            }
            resolve(response)
        }
    } catch (error) {
        console.log("catch")
        const response:auth_res = {
            
            "status" : "error",
            massage : "error",
            "verified": false
        }
        resolve(response);
    }
    })
    return response
}

export async function authenticate(req:any , api_no:number):Promise<auth_return>{
    const response =await getDecode(req)
    console.log(response)
    if(response.verified){
        const api_auth : api_auth = {
            api_no:api_no,
            type:response.token!.userType
        }
        var condition =await check_authorization(api_auth)
        console.log("condition ",condition)
        if(condition){
            return {
                "condition" : true,
                "userId" : response.token.userId
            }
        }
        else{
            return {
                "condition" : false,
                "userId" : "null"
            }
        }
    }
    return {
        "condition" : false,
        "userId" : "null"
    }
}