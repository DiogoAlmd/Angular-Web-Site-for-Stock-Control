import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CidadesStores } from '../interfaces/cidadesStores';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { Store } from '../interfaces/store';
import { headersPost } from '../repositories/headersPost';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http:HttpClient) { }

  getStore(id:string): Observable<Store[]>{
    return this.http.get<Store[]>(URLPadrao + `/Store/ObterDados/${id}`,{headers:headers()});
  }

  moverParaCliente(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Store',data,{headers:headersPost()})
  }

  moverParaDefeitoStore(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Store/MoverParaDefeitoExterior',data,{headers:headersPost()})
  }

  moverParaEmTransito(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Store/MoverParaEmTransito',data,{headers:headersPost()})
  }

  getCidadesStores():Observable<CidadesStores[]>{
    return this.http.get<CidadesStores[]>(URLPadrao+'/Store/Modelos',{headers:headers()})
  }

  getModelos(id:string):Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+`/Store/ModelosReais/${id}`,{headers:headers()})
  }
}
