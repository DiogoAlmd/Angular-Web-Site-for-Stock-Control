import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Historico } from '../interfaces/historico';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { Observable } from 'rxjs';
import { headersPost } from '../repositories/headersPost';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(private http: HttpClient) { }

  getHistorico(role:string,user:string): Observable<Historico[]>{
    return this.http.get<Historico[]>(URLPadrao + `/Historico/ObterDados/${role}/${user}`,{headers:headers()});
  }

  desfazerHistorico(id:string,serial:string,origem:string,destino:string):Observable<void>{
    return this.http.post<void>(URLPadrao+`/Historico/desfazer/${id}/${serial}/${origem}/${destino}`,{},{headers:headersPost()})
  }
}
