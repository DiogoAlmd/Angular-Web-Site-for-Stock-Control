import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstoqueAB } from '../interfaces/estoqueAB';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { Modelos } from '../interfaces/modelos';
import { headersPost } from '../repositories/headersPost';

@Injectable({
  providedIn: 'root'
})
export class EstoqueABService {

  constructor(private http:HttpClient) { }

  getEstoqueAB(): Observable<EstoqueAB[]>{
    return this.http.get<EstoqueAB[]>(URLPadrao + '/EstoqueAB',{headers:headers()});
  }

  getModelos():Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+'/EstoqueAB/Modelos',{headers:headers()})
  }

  moverParaNovaTabela(serial:string, usuario:string, propriedade:string, operadora:string):Observable<void>{
    if(propriedade && operadora){
      let novaTabela = 'ARMARIO_1'
      return this.http.post<void>(URLPadrao+`/EstoqueAB/MoverParaNovaTabela/${serial}/${novaTabela}/${usuario}/?propriedade=${propriedade}&operadora=${operadora}`,{},{headers:headersPost()})
    }
    else{
      let novaTabela = 'ARMARIO_3'
      return this.http.post<void>(URLPadrao+`/EstoqueAB/MoverParaNovaTabela/${serial}/${novaTabela}/${usuario}`,{},{headers:headersPost()})
    }
  }

  moverParaDefeito(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/EstoqueAB/MoverParaDefeito',data,{headers:headersPost()})
  }
}
