import { Component } from '@angular/core';
import { Payload } from 'src/app/interfaces/payload';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.css']
})
export class SistemaComponent {
  collapsed = true;
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  constructor(private router:Router, private userService:UserService, private solicitacaoService: SolicitacaoService){
  }

  payload?:Payload;
  funcao?:string
  store?:string
  imagem=''
  
  ngOnInit(){
    this.userService.verificaTokenExistente().subscribe({
      next: () =>{
        this.payload=getUserInfo();
        if(this.payload!==undefined){
          this.funcao=this.payload.role;
          this.store=this.payload.groupsid;
          this.verificaNaoFinalizadas();
        }
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });
  }

  verificaNaoFinalizadas(){
    this.solicitacaoService.verificaNaoFinalizada(this.store!).subscribe({
      next: (dado)=>{
        if(dado.contador==0)
          this.imagem='../../../assets/images/sino.png'
        else
          this.imagem='../../../assets/images/comNotificacao.png'
        if(this.funcao=="CONSULTOR")
          this.router.navigate(['/sistema/store'])
        else
        this.router.navigate(['/sistema/armario1'])
      },
      error:(error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

}
