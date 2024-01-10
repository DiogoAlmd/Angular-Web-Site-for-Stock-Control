import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devolucao } from '../interfaces/devolucao';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class DevolucaoService {

  constructor(private http: HttpClient) { }

  getDevolucao(): Observable<Devolucao[]>{
    return this.http.get<Devolucao[]>(URLPadrao + '/Devolucao',{headers:headers()});
  }

  getModelos():Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+'/Devolucao/Modelos',{headers:headers()})
  }
}
