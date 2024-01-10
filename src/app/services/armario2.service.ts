import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Armario2 } from '../interfaces/armario2';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class Armario2Service {

  constructor(private http: HttpClient) { }

  getArmario2(): Observable<Armario2[]>{
    return this.http.get<Armario2[]>(URLPadrao + '/Armario2',{headers:headers()});
  }

  moverParaDefeito(data:string): Observable<void>{
    return this.http.post<void>(URLPadrao+'/Armario2/MoverParaDefeito',data,{headers:headersPost()});
  }

  getArmario2Modelos(): Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+'/Armario2/Modelos',{headers:headers()})
  }

  moverParaArmario1(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+`/Armario2/MoverParaArmario1/`,data,{headers:headersPost()})
  }
}
