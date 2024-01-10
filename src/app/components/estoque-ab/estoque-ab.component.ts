import { Component, TemplateRef, ViewChild } from '@angular/core';
import { EstoqueAB } from 'src/app/interfaces/estoqueAB';
import { Modelos } from 'src/app/interfaces/modelos';
import { EstoqueABService } from 'src/app/services/estoque-ab.service';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listaCaixas } from 'src/app/repositories/listaCaixas';
import { listaDefeitos } from 'src/app/repositories/listaDefeitos';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-estoque-ab',
  templateUrl: './estoque-ab.component.html',
  styleUrls: ['./estoque-ab.component.css']
})
export class EstoqueABComponent {
  constructor(
    private estoqueABService: EstoqueABService,
    private router:Router,
    private modalService: BsModalService
    ){}

  usuario='';
  propriedade='';
  
  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;

  modalRef!: BsModalRef;
  estoqueAB: EstoqueAB[]=[];
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  selectedSerial='';
  operadora='';
  caixa='';
  motivo='';
  listaCaixas:string[] = listaCaixas;
  listaDefeitos:string[] = listaDefeitos;
  novaTabela='';
  selectedOpcao = '';

  ngOnInit(){
    this.getEstoqueAB();
    this.getModelos();
  }

  getEstoqueAB(){
    this.estoqueABService.getEstoqueAB().subscribe({
      next: (eab) =>{
        this.estoqueAB=eab;
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
    this.estoqueABService.getModelos().subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaNovaTabela(){
    this.estoqueABService.moverParaNovaTabela(this.selectedSerial,this.usuario, this.propriedade, this.operadora).subscribe({
      next: ()=>{
        this.fechaModal()
        const estoqueAB = $('#tabela-estoqueAB').DataTable()
        estoqueAB.destroy();
        this.ngOnInit();
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

  moverParaDefeito(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "caixa": this.caixa,
      "motivo": this.motivo,
      "usuario":this.usuario
    });
    this.estoqueABService.moverParaDefeito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const estoqueAB = $('#tabela-estoqueAB').DataTable()
        estoqueAB.destroy();
        this.ngOnInit();
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
      const estoqueAB = $('#tabela-estoqueAB').DataTable({
        data: this.estoqueAB,
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

      $('#tabela-estoqueAB tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = estoqueAB.row($(event.target).closest('tr')).data();
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

  onSubmit(){
    if(this.selectedOpcao == 'moverParaArmario1' || this.selectedOpcao == 'moverParaArmario3'){
      console.log(this.operadora)
      this.moverParaNovaTabela();
    }

    else if(this.selectedOpcao == 'moverParaDefeito'){
      this.moverParaDefeito()
    }
  }

  fechaModal(){
    this.modalService.hide()
    this.selectedOpcao=''
    this.resetaCampos()
  }

  resetaCampos(){
    this.operadora='';
    this.caixa='';
    this.motivo='';
    this.novaTabela=''
    this.propriedade=''
  }
}
