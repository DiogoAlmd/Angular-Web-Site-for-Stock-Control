import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Armario2 } from 'src/app/interfaces/armario2';
import { Modelos } from 'src/app/interfaces/modelos';
import { Armario2Service } from 'src/app/services/armario2.service';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listaCaixas } from 'src/app/repositories/listaCaixas';
import { listaDefeitos } from 'src/app/repositories/listaDefeitos';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-armario2',
  templateUrl: './armario2.component.html',
  styleUrls: ['./armario2.component.css']
})
export class Armario2Component {
  constructor(
    private armario2Service:Armario2Service,
    private router:Router,
    private modalService: BsModalService  
  ){}
  usuario=''
  propriedade=''

  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('modalLote') modalLote!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;
  
  modalRef!: BsModalRef;
  armario2: Armario2[]=[];
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  selectedSerial='';
  operadora='';
  caixa='';
  motivo='';
  listaCaixas:string[] = listaCaixas;
  listaDefeitos:string[] = listaDefeitos;
  selectedOpcao = '';
  seriais=''

  ngOnInit(){
    this.getArmario2();
    this.getModelos();
  }

  getArmario2(){
    this.armario2Service.getArmario2().subscribe({
      next: (a2) =>{
        this.armario2=a2;
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
    this.armario2Service.getArmario2Modelos().subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }
  
  moverParaArmario1(){
    let vetor=[this.selectedSerial]
    let params = JSON.stringify({
      "seriais":vetor,
      "operadora":this.operadora,
      "propriedade":this.propriedade,
      "usuario":this.usuario
    })
    this.armario2Service.moverParaArmario1(params).subscribe({
      next: ()=>{this.fechaModal();
        const tabelaHistorico = $('#tabela-armario2').DataTable();
        tabelaHistorico.destroy();
        this.ngOnInit()},
      error: (error)=>{this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaArmario1EmLotes(){
    let vetorSeriais=this.seriais.split('\n')
    if(vetorSeriais[vetorSeriais.length-1]=='')
      vetorSeriais.pop()
    let params = JSON.stringify({
      "seriais":vetorSeriais,
      "operadora":this.operadora,
      "propriedade":this.propriedade,
      "usuario":this.usuario
    })
    this.armario2Service.moverParaArmario1(params).subscribe({
      next: ()=>{this.fechaModal();
        const tabelaHistorico = $('#tabela-armario2').DataTable();
        tabelaHistorico.destroy();
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
        else if(error.status==409)
          alert(error.error.message)
      }
    })
  }

  moverParaDefeito(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "caixa": this.caixa,
      "motivo": this.motivo,
      "usuario": this.usuario
    });
    this.armario2Service.moverParaDefeito(params).subscribe({
      next: ()=>{this.fechaModal()
        const tabelaHistorico = $('#tabela-armario2').DataTable();
        tabelaHistorico.destroy();
        this.ngOnInit()
          },
          error: (error) =>{this.fechaModal()
            if(error.status==401 || error.status==403)
              this.router.navigate(['ohno', '401'])
            else if(error.status==500)
              this.router.navigate(['ohno','500'])
          }
        });
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaArmario2 = $('#tabela-armario2').DataTable({
        data: this.armario2,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'status' },
          { data: 'situacao' },
          { data: 'local' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      $('#tabela-armario2 tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaArmario2.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.openModalOpcoes(rowData.serial);
        }
      })
    });
  }

  openModalOpcoes(serial: string) {
    this.modalRef = this.modalService.show(this.modalOpcoes);
  }

  onSubmit(){
    if(this.selectedOpcao == 'moverParaArmario1'){
      this.moverParaArmario1();
    }

    else if(this.selectedOpcao == 'moverParaDefeito'){
      this.moverParaDefeito()
    }
  }

  fechaModal(){
    this.modalService.hide()
    this.resetaCampos()
    this.selectedOpcao = ''
  }

  resetaCampos(){
    this.operadora=''
    this.propriedade=''
    this.caixa=''
    this.motivo=''
  }

  onSubmit2(){
    this.operadora='N.A'
    this.propriedade='NÃO'
    this.moverParaArmario1EmLotes()
  }

  abreModal(){
    this.modalService.show(this.modalLote);
  }
}
