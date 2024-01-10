import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Armario3 } from '../interfaces/armario3';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class Armario3Service {

  constructor(private http: HttpClient) { }

  getArmario3(): Observable<Armario3[]>{
    return this.http.get<Armario3[]>(URLPadrao + '/Armario3',{headers:headers()});
  }

  moverParaDefeito(data:string): Observable<void>{
    return this.http.post<void>(URLPadrao+'/Armario3/MoverParaDefeito',data,{headers:headersPost()});
  }

  getArmario3Modelos(): Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+'/Armario3/Modelos',{headers:headers()})
  }

  moverParaArmario1(serial:string,operadora:string,propriedade:string,usuario:string):Observable<void>{
    return this.http.post<void>(URLPadrao+`/Armario3/MoverParaArmario1/${serial}/${operadora}/${propriedade}/${usuario}`,{},{headers:headersPost()})
  }
  
}
