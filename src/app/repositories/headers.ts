import { HttpHeaders } from '@angular/common/http';
import { getToken } from './getToken';

export function headers(){
    return new HttpHeaders()
    .set('Authorization',('Bearer '+ getToken()))
}