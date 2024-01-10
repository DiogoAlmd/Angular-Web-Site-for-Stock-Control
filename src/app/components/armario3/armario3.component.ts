import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Armario3 } from 'src/app/interfaces/armario3';
import { Modelos } from 'src/app/interfaces/modelos';
import { Armario3Service } from 'src/app/services/armario3.service';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listaCaixas } from 'src/app/repositories/listaCaixas';
import { listaDefeitos } from 'src/app/repositories/listaDefeitos';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-armario3',
  templateUrl: './armario3.component.html',
  styleUrls: ['./armario3.component.css']
})
export class Armario3Component {
  constructor(
    private armario3Service: Armario3Service,
    private router: Router,
    private modalService: BsModalService
    ){}

  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;

  modalRef!: BsModalRef;
  armario3: Armario3[]=[];
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  selectedSerial='';
  operadora='';
  caixa='';
  motivo='';
  opcao: string = '';
  listaCaixas:string[] = listaCaixas;
  listaDefeitos:string[] = listaDefeitos;
  selectedOpcao = '';
  usuario='';
  propriedade='';

  ngOnInit(){
    this.getArmario3();
    this.getModelos();
  }

  getArmario3(){
    this.armario3Service.getArmario3().subscribe({
      next: (a3) =>{
        this.armario3=a3;
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
    this.armario3Service.getArmario3Modelos().subscribe({
      next: (m)=>{this.modelos=m[0]},
      error: (error)=>{
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
      "usuario": this.usuario
    });
    this.armario3Service.moverParaDefeito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaArmario3 = $('#tabela-armario3').DataTable()
        tabelaArmario3.destroy();
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

  moverParaArmario1(){
    this.armario3Service.moverParaArmario1(this.selectedSerial, this.operadora, this.propriedade, this.usuario).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaArmario3 = $('#tabela-armario3').DataTable()
        tabelaArmario3.destroy();
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
      const tabelaArmario3 = $('#tabela-armario3').DataTable({
        data: this.armario3,
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

      $('#tabela-armario3 tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaArmario3.row($(event.target).closest('tr')).data();
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
}
