import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { Solicitacao } from '../interfaces/solicitacao';


@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {

  constructor(private http: HttpClient) { }

  getSolicitacao(id:string):Observable<Solicitacao[]>{
    return this.http.get<Solicitacao[]>(URLPadrao+`/Solicitacao/ObterDados/${id}`,{headers:headers()});
  }

  enviaSolicitacao(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Solicitacao/SolicitarMaquina',data,{headers:headersPost()});
  }

  deleteSolicitacao(id:string):Observable<void>{
    return this.http.delete<void>(URLPadrao+`/Solicitacao/DeleteSolicitacao/${id}`,{headers:headers()})
  }

  verificaNaoFinalizada(id:string):Observable<any>{
    return this.http.get<any>(URLPadrao+`/Solicitacao/VerificaNaoFinalizadas/${id}`,{headers:headers()})
  }
}
