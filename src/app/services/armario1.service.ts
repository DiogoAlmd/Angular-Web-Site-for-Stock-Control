import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Armario1 } from '../interfaces/armario1';
import { URLPadrao } from '../config/rotaPadrao';
import { headers } from '../repositories/headers';
import { headersPost } from '../repositories/headersPost';
import { Modelos } from '../interfaces/modelos';

@Injectable({
  providedIn: 'root'
})
export class Armario1Service {

  constructor(private http: HttpClient) { }

  getArmario1(): Observable<Armario1[]>{
    return this.http.get<Armario1[]>(URLPadrao + '/Armario1',{headers:headers()});
  }

  moverParaCliente(data:string): Observable<void>{
    return this.http.post<void>(URLPadrao+'/Armario1',data,{headers:headersPost()});
  }

  moverParaDefeito(data:string): Observable<void>{
    return this.http.post<void>(URLPadrao+'/Armario1/MoverParaDefeito',data,{headers:headersPost()});
  }

  alterarCampo(serial:string, campo:string, usuario:string, valor:string): Observable<void>{
    return this.http.post<void>(URLPadrao+`/Armario1/AlterarCampo/${serial}/${campo}/${usuario}?valor=${valor}`,{},{headers:headersPost()});
  }

  getArmario1Modelos(): Observable<Modelos[]>{
    return this.http.get<Modelos[]>(URLPadrao+'/Armario1/Modelos',{headers:headers()})
  }

  moverParaEmTransito(data:string): Observable<void>{
    return this.http.post<void>(URLPadrao+'/Armario1/MoverParaEmTransito',data,{headers:headersPost()})
  }
}
