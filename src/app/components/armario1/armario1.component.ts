import { Component, TemplateRef, ViewChild} from '@angular/core';
import { Armario1 } from 'src/app/interfaces/armario1';
import { Modelos } from 'src/app/interfaces/modelos';
import { Armario1Service } from 'src/app/services/armario1.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listaCaixas } from 'src/app/repositories/listaCaixas';
import { listaDefeitos } from 'src/app/repositories/listaDefeitos';
import { cidades } from 'src/app/repositories/cidadesStore';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { carteiras } from 'src/app/repositories/carteiras';

declare var $: any;

@Component({
  selector: 'app-armario1',
  templateUrl: './armario1.component.html',
  styleUrls: ['./armario1.component.css']
})
export class Armario1Component {
  constructor(
    private armario1Service: Armario1Service,
    private modalService: BsModalService,
    private router:Router,
  ) {}

  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('modalLote') modalLote!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;

  modalRef!: BsModalRef;
  listaCaixas:string[] = listaCaixas;
  listaDefeitos:string[] = listaDefeitos;
  cidades:string[] = cidades;
  usuario=''

  armario1: Armario1[] = [];
  minhaDiv: string = '';
  opcaoSelecionada: string = '';
  selectedOpcao = '';
  selectedSerial: string = '';
  cnpf: string = '';
  empresa: string = '';

  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  caixa=''
  motivo=''
  campo=''
  novoValor=''
  cidadeStore=''
  transporte=''
  codigo=''
  seriais=''
  cidades2=this.cidades
  destino=''
  carteiras:string[]=carteiras


  ngOnInit(){
    this.getArmario1();
    this.getModelos();
  }

  getArmario1(){
    this.armario1Service.getArmario1().subscribe({
      next: (a1) => {
        this.armario1 = a1;
        this.initDataTable();
        let payload = getUserInfo();
        if(payload!==undefined)
          this.usuario=payload.unique_name;
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
    this.armario1Service.getArmario1Modelos().subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaCliente(){
    let vetor=[this.selectedSerial]
    let params = JSON.stringify({
      "seriais": vetor,
      "cnpf": this.cnpf,
      "empresa": this.empresa,
      "usuario": this.usuario,
      "store":this.cidadeStore,
    });
    this.armario1Service.moverParaCliente(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const tabelaArmario1 = $('#tabela-armario1').DataTable();
        tabelaArmario1.destroy();
        this.ngOnInit()
      },
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });

  }

  moverParaClienteEmLote(){
    let vetorSeriais=this.seriais.split('\n')
    if(vetorSeriais[vetorSeriais.length-1]=='')
      vetorSeriais.pop()
    let params = JSON.stringify({
      "seriais": vetorSeriais,
      "cnpf": this.cnpf,
      "empresa": this.empresa,
      "usuario": this.usuario,
      "store":this.cidadeStore,
    });
    this.armario1Service.moverParaCliente(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const tabelaArmario1 = $('#tabela-armario1').DataTable();
        tabelaArmario1.destroy();
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
        else if(error.status==409)
          alert(error.error.message)
      }
    });

  }

  moverParaDefeito(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "caixa": this.caixa,
      "motivo": this.motivo,
      "usuario": this.usuario,
    });
    this.armario1Service.moverParaDefeito(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const tabelaArmario1 = $('#tabela-armario1').DataTable();
        tabelaArmario1.destroy();
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

  alterarCampo(){
    this.armario1Service.alterarCampo(this.selectedSerial,this.campo,this.usuario,this.novoValor).subscribe({
      next: ()=>{
        this.fechaModal();
        const tabelaArmario1 = $('#tabela-armario1').DataTable();
        tabelaArmario1.destroy();
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
   let vetor=[this.selectedSerial]
    let params = JSON.stringify({
      "seriais": vetor,
      "local": this.cidadeStore,
      "usuario": this.usuario,
      "transporte":'Aguardando Código'
    });
    this.armario1Service.moverParaEmTransito(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const tabelaArmario1 = $('#tabela-armario1').DataTable();
        tabelaArmario1.destroy();
        this.ngOnInit()},
      error: (error)=>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
        else if(error.status==422)
          alert(error.error.message)
      }
    })
  }

  moverParaEmTransitoEmLotes(){
    let vetorSeriais=this.seriais.split('\n')
    if(vetorSeriais[vetorSeriais.length-1]=='')
      vetorSeriais.pop()
      let params = JSON.stringify({
        "seriais": vetorSeriais,
        "local": this.cidadeStore,
        "usuario": this.usuario,
        "transporte":'Aguardando Código'
      });
      this.armario1Service.moverParaEmTransito(params).subscribe({
        next: ()=>{this.fechaModal();
          const tabelaArmario1 = $('#tabela-armario1').DataTable();
          tabelaArmario1.destroy();
          this.ngOnInit()},
        error: (error)=>{
          if(error.status==401 || error.status==403){
            this.fechaModal()
            this.router.navigate(['ohno', '401'])
          }
          else if(error.status==500){
            this.fechaModal()
            this.router.navigate(['ohno','500'])
          }
          else if(error.status==422)
            alert(error.error.message)
          else if(error.status==409)
            alert(error.error.message)
        }
      })
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaArmario1 = $('#tabela-armario1').DataTable({
        data: this.armario1,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'status' },
          { data: 'situacao' },
          { data: 'local' },
          { data: 'operadora' },
          { data: 'maquinaPropriaDoCliente' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      // Adicione o evento de clique ao botão "botaoEditar"
      $('#tabela-armario1 tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaArmario1.row($(event.target).closest('tr')).data();
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
    this.cnpf=''
    this.empresa=''
    this.cidadeStore=''
    this.novoValor=''
    this.campo=''
    this.caixa=''
    this.motivo=''
    this.transporte=''
    this.codigo=''
    this.destino=''
  }
  
  onSubmit(){
    if(this.selectedOpcao == 'moverParaCliente'){
      this.moverParaCliente();
    }

    else if(this.selectedOpcao== 'moverParaDefeito'){
      this.moverParaDefeito()
    }

    else if(this.selectedOpcao== 'alterarCampo'){
      this.alterarCampo();
    }

    else if(this.selectedOpcao == 'moverParaStore'){
      this.moverParaEmTransito();
    }
  }

  onSubmit2(){
    if (this.destino=='EMTRANSITO')
      this.moverParaEmTransitoEmLotes()
    else
    this.moverParaClienteEmLote()
  }

  abreModal(destino:string){
    this.destino=destino
    this.modalService.show(this.modalLote);
  }
}
