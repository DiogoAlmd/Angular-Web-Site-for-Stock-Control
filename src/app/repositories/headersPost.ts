import { HttpHeaders } from '@angular/common/http';
import { getToken } from './getToken';

export function headersPost(){
    return new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('accept', '*/*')
    .set('Authorization',('Bearer '+ getToken()))
}