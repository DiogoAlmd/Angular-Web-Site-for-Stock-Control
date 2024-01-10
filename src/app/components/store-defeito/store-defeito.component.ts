import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CidadesStores } from 'src/app/interfaces/cidadesStores';
import { Modelos } from 'src/app/interfaces/modelos';
import { StoreDefeito } from 'src/app/interfaces/storeDefeito';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { StoreDefeitoService } from 'src/app/services/store-defeito.service';
import { NgForm } from '@angular/forms';
import { cidades } from 'src/app/repositories/cidadesStore';
import { UserService } from 'src/app/services/user.service';
declare var $: any;
@Component({
  selector: 'app-store-defeito',
  templateUrl: './store-defeito.component.html',
  styleUrls: ['./store-defeito.component.css']
})
export class StoreDefeitoComponent {
  constructor(private userService:UserService, private storeDefeitoService: StoreDefeitoService, private modalService: BsModalService,private router:Router){}
  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('modalLote') modalLote!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;

  modalRef!: BsModalRef;
  storeDefeito: StoreDefeito[]=[]
  cidades:string[] = cidades;
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  cidadesStores:CidadesStores ={
    rioPreto:'',
    campoGrande:'',
    rioDeJaneiro:'',
    campinas:'',
    sorocaba:'',
    total:''}
    cidadeStore=''
    selectedSerial=''
    local=''
    situacao=''
    usuario=''
    groupid=''
    transporte=''
    codigo=''
    seriais=''
    funcao=''
    

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
          this.groupid=payload.groupsid;
          this.funcao=payload.role;
          this.getStoreDefeito()
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

  getStoreDefeito(){
    this.storeDefeitoService.getStoreDefeito(this.groupid).subscribe({
      next: (sd) =>{
        this.storeDefeito=sd;
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
    this.storeDefeitoService.getModelos(this.groupid).subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
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
    let vetor=[this.selectedSerial]
    let params = JSON.stringify({
      "seriais": vetor,
      "local": this.local,
      "usuario":this.usuario,
      "transporte":this.transporte
    });
    this.storeDefeitoService.moverParaEmTransito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaDefeitoStore = $('#tabela-DefeitoStore').DataTable();
        tabelaDefeitoStore.destroy();
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

  moverParaEmTransitoEmLotes(){
    if(this.transporte=='Correio')
      this.transporte=this.codigo
    let vetorSeriais=this.seriais.split('\n')
    if(vetorSeriais[vetorSeriais.length-1]=='')
      vetorSeriais.pop()
    if(this.funcao!='CONSULTOR')
      this.local=this.cidadeStore
    else{
      switch(this.groupid){
        case '4': {this.local='STORE RIO PRETO'
                          break;}
        case '8': {this.local='RIO DE JANEIRO'
                          break;}
        case '6': {this.local='STORE CAMPO GRANDE'
                          break;}
        case '9': {this.local='STORE CAMPINAS'
                          break;}
        case '2': {this.local='STORE SOROCABA'
                          break;}
      }
    }
    let params = JSON.stringify({
      "seriais": vetorSeriais,
      "local": this.local,
      "usuario":this.usuario,
      "transporte":this.transporte
    });
    this.storeDefeitoService.moverParaEmTransito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaDefeitoStore = $('#tabela-DefeitoStore').DataTable();
        tabelaDefeitoStore.destroy();
        this.ngOnInit()
      },
      error: (error)=>{
        if(error.status==401 || error.status==403){
          this.fechaModal()
          this.router.navigate(['ohno', '401'])
        }
        else if(error.status==500){
          this.fechaModal()
          this.router.navigate(['ohno','500'])
        }
        else if(error.status==409){
          alert(error.error.message)
          if(this.codigo!='')
            this.transporte='Correio'
        }
      }
    })
  }

  getCidadesStores(){
    this.storeDefeitoService.getCidadesStores().subscribe({
      next: (cs)=>{this.cidadesStores=cs[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaDefeitoStore = $('#tabela-DefeitoStore').DataTable({
        data: this.storeDefeito,
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
      $('#tabela-DefeitoStore tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaDefeitoStore.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.local=rowData.local
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
      this.situacao=''
      this.local=''
      this.codigo=''
      this.transporte=''
      this.cidadeStore=''
      this.seriais=''
    }

    onSubmit(){
      this.moverParaEmTransito()
    }

    onSubmit2(){
      this.moverParaEmTransitoEmLotes()
    }
  
    abreModal(){
      this.modalService.show(this.modalLote);
    }
}
