import { load } from 'ts-dotenv';
import jwt from 'jsonwebtoken'
import { token_body } from '../types';

export function issue_token(token_body:token_body){
    let jwtSecretKey = "njkgsdjgflskfmmfhskfkmfbffkdffmk";
    let data = {
        time: Date(),
        userId: token_body.userId,
        userType: token_body.userType,
        email:token_body.email,
    }
    console.log(data)
    const token = jwt.sign(data, jwtSecretKey);
      return token
}