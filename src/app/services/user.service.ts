import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { token } from '../interfaces/token';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,) { }

  login(usuario:Usuario): Observable<token>{
    return this.http.post<token>(URLPadrao + '/Users/login',usuario);
  }

  verificaTokenExistente():Observable<void>{
    return this.http.get<void>(URLPadrao+'/Users/authenticated',{headers:headers()})
  }
}
