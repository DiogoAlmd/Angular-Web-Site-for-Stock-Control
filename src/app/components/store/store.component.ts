import { Component, TemplateRef, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { CidadesStores } from 'src/app/interfaces/cidadesStores';
import { Modelos } from 'src/app/interfaces/modelos';
import { Store } from 'src/app/interfaces/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { StoreService } from 'src/app/services/store.service';
import { NgForm } from '@angular/forms';
import { cidades } from 'src/app/repositories/cidadesStore';
import { UserService } from 'src/app/services/user.service';
import { listaModelos } from 'src/app/repositories/listaModelos';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';
declare var $: any;

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {
  constructor(private solicitacaoService:SolicitacaoService ,private storeService: StoreService,private modalService: BsModalService, private router:Router, private userService:UserService){}
  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('modalSolicitacao') modalSolicitacao!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;

  modalRef!: BsModalRef;
  store: Store[]=[]
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  cidadesStores:CidadesStores={
    rioPreto:'',
    campoGrande:'',
    rioDeJaneiro:'',
    campinas:'',
    sorocaba:'',
    total:''}
    selectedSerial=''
    cnpf=''
    empresa=''
    local=''
    situacao=''
    usuario=''
    selectedOpcao = ''
    cidades=cidades
    groupid=''
    listaModelos=listaModelos
    modelo=''
    quantidade=1
    funcao=''
    cidadeStore=''
    transporte=''
    codigo=''

  ngOnInit(){
    this.verificaToken()
    this.getCidadesStores()
  }

  verificaToken(){
    this.userService.verificaTokenExistente().subscribe({
      next:()=>{
        let payload = getUserInfo();
        if(payload!==undefined){
          this.usuario=payload.unique_name;
          this.groupid=payload.groupsid
          this.funcao=payload.role
          this.getStore()
          this.getModelos()
        }
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])}
    })
  }

  getStore(){
    this.storeService.getStore(this.groupid).subscribe({
      next: (s) =>{
        this.store=s;
        this.initDataTable();
        },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });
  }

  getModelos(){
    this.storeService.getModelos(this.groupid).subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  getCidadesStores(){
    this.storeService.getCidadesStores().subscribe({
      next: (cs)=>{this.cidadesStores=cs[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaCliente(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "cnpf": this.cnpf,
      "empresa": this.empresa,
      "usuario":this.usuario
    });
    this.storeService.moverParaCliente(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaStore = $('#tabela-Store').DataTable();
        tabelaStore.destroy();
        this.ngOnInit()
      },
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaDefeitoStore(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario": this.usuario
    });
    this.storeService.moverParaDefeitoStore(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaStore = $('#tabela-Store').DataTable();
        tabelaStore.destroy();
        this.ngOnInit()
      },
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaEmTransito(){
    if(this.transporte=='Correio')
      this.transporte=this.codigo
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario":this.usuario,
      "transporte":this.transporte
    });
    this.storeService.moverParaEmTransito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaStore = $('#tabela-Store').DataTable();
        tabelaStore.destroy();
        this.ngOnInit()
      },
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaStore = $('#tabela-Store').DataTable({
        data: this.store,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'local' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      // Adicione o evento de clique ao botão "botaoEditar"
      $('#tabela-Store tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaStore.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.openModalOpcoes(rowData.serial);
        }
      });
    });
  }

  openModalOpcoes(serial: string) {
    this.modalRef = this.modalService.show(this.modalOpcoes);
  }

fechaModal(){
    this.modalService.hide()
    this.resetaCampos()
    this.selectedOpcao = ''
  }

  resetaCampos(){
    this.situacao=''
    this.local=''
    this.empresa=''
    this.cnpf=''
    this.modelo=''
    this.quantidade=1
    this.cidadeStore=''
    this.transporte=''
    this.codigo=''
  }

  enviaSolicitacao(){
    let lugarStore=''
    if (this.funcao=='CONSULTOR')
      lugarStore=this.groupid
    else
      switch(this.cidadeStore){
        case 'STORE RIO PRETO': {lugarStore='4'
                          break;}
        case 'RIO DE JANEIRO': {lugarStore='8'
                          break;}
        case 'STORE CAMPO GRANDE': {lugarStore='6'
                          break;}
        case 'STORE CAMPINAS': {lugarStore='9'
                          break;}
        case 'STORE SOROCABA': {lugarStore='2'
                          break;}
      }
    let params = JSON.stringify({
      "usuario":this.usuario,
      "store": lugarStore,
      "modelo":this.modelo,
      "quantidade": String(this.quantidade)
    });
    this.solicitacaoService.enviaSolicitacao(params).subscribe({
      next: ()=>{
        this.fechaModal()
      },
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }
  onSubmit1(){
    if(this.selectedOpcao == 'moverParaCliente'){
      this.moverParaCliente();
    }

    else if(this.selectedOpcao== 'moverParaDefeitoStore'){
      this.moverParaDefeitoStore()
    }

    else if(this.selectedOpcao== 'moverParaEmTransito'){
      this.moverParaEmTransito();
    }
  }

  onSubmit2(){
    this.enviaSolicitacao()
  }

  abreModal(){
    this.modalService.show(this.modalSolicitacao);
  }
}
