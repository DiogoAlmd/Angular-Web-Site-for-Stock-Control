import jwtDecode from 'jwt-decode';
import { Payload } from '../interfaces/payload';
import { getToken } from './getToken';

let payload:Payload

export function getUserInfo(){
    const token = getToken()
    if(token){
      try{
        payload = jwtDecode(token);
        return payload
      }
      catch(error){
        return undefined
      }
    }
    else
     return undefined
  }