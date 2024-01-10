import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaquinasNosClientes } from '../interfaces/maquinasNosClientes';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class MaquinasNosClientesService {

  constructor(private http: HttpClient) { }

  getMaquinasNosClientes(id:string): Observable<MaquinasNosClientes[]>{
    console.log(id);
    return this.http.get<MaquinasNosClientes[]>(URLPadrao + `/MaquinasNosClientes/ObterDados/${id}`,{headers:headers()});
  }

  moverParaEmTransito(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/MaquinasNosClientes/MoverParaEmTransito',data,{headers:headersPost()})
  }

  moverParaStore(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/MaquinasNosClientes/MoverParaStore',data,{headers:headersPost()})
  }

  moverParaStoreDefeito(data:string):Observable<void>{
    return this.http.post<void>(URLPadrao+'/MaquinasNosClientes/MoverParaStoreDefeito',data,{headers:headersPost()})
  }

  getModelosEntreDatas(dataInicial:string,dataFinal:string,id:string):Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+`/MaquinasNosClientes/Modelos/${dataInicial}/${dataFinal}/${id}`,{headers:headers()})
  }

  getModelosTotal(id:string):Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+`/MaquinasNosClientes/ModeloTotal/${id}`,{headers:headers()})
  }

  migracaoCadastro(serial:string,cnpf:string,nome:string,usuario:string,store:string):Observable<void>{
    return this.http.post<void>(URLPadrao+`/MaquinasNosClientes/MigracaoCadastro/${serial}/${cnpf}/${nome}/${usuario}/${store}`,{},{headers:headersPost()});
  }

  encerraEvento(serial:string,usuario:string):Observable<any>{
    return this.http.post<any>(URLPadrao+`/MaquinasNosClientes/MoverParaArmario2/${serial}/${usuario}`,{},{headers:headersPost()});
  }
}
