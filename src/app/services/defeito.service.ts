import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defeito } from '../interfaces/defeito';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { MotivoDefeito } from '../interfaces/motivoDefeito';

@Injectable({
  providedIn: 'root'
})
export class DefeitoService {

  constructor(private http:HttpClient) { }


  getDefeito():Observable<Defeito[]>{
    return this.http.get<Defeito[]>(URLPadrao+'/Defeitos',{headers:headers()})
  }

  alterarMotivo(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Defeitos/AlterarMotivo',data,{headers:headersPost()})
  }

  moverParaDevolucao(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/Defeitos/MoverParaDevolucao',data,{headers:headersPost()})
  }

  getMotivos():Observable<MotivoDefeito[]>{
    return this.http.get<MotivoDefeito[]>(URLPadrao+'/Defeitos/Motivos',{headers:headers()})
  }

}
