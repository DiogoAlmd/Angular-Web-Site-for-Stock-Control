import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmTransito } from '../interfaces/emTransito';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';


@Injectable({
  providedIn: 'root'
})
export class EmTransitoService {

  constructor(private http:HttpClient) { }

  getEmTransito(id:string,usuario:string):Observable<EmTransito[]>{
    return this.http.get<EmTransito[]>(URLPadrao+`/EmTransito/ObterDados/${id}/${usuario}`,{headers:headers()});
  }
  
  moverParaStore(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/EmTransito/MoverParaStore',data,{headers:headersPost()})
  }

  moverParaArmario2(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/EmTransito/MoverParaArmario2',data,{headers:headersPost()})
  }

  alterarCodigo(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/EmTransito/AlterarCodigo',data,{headers:headersPost()})
  }
}
