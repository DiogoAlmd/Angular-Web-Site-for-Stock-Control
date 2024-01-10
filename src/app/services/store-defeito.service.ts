import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreDefeito } from '../interfaces/storeDefeito';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { Modelos } from '../interfaces/modelos';
import { headersPost } from '../repositories/headersPost';
import { CidadesStores } from '../interfaces/cidadesStores';

@Injectable({
  providedIn: 'root'
})
export class StoreDefeitoService {

  constructor(private http:HttpClient) { }

  getStoreDefeito(id:string): Observable<StoreDefeito[]>{
    return this.http.get<StoreDefeito[]>(URLPadrao + `/StoreDefeito/ObterDados/${id}`,{headers:headers()});
  }

  getCidadesStores(): Observable<CidadesStores[]>{
    return this.http.get<CidadesStores[]>(URLPadrao+'/StoreDefeito/Modelos',{headers:headers()})
  }

  moverParaEmTransito(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/StoreDefeito/MoverParaEmTransito',data,{headers:headersPost()})
  }

  getModelos(id:string):Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+`/StoreDefeito/ModelosReais/${id}`,{headers:headers()})
  }
}
