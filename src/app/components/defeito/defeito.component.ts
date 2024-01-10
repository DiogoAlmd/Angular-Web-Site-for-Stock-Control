import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Defeito } from 'src/app/interfaces/defeito';
import { MotivoDefeito } from 'src/app/interfaces/motivoDefeito';
import { DefeitoService } from 'src/app/services/defeito.service';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { listaCaixas } from 'src/app/repositories/listaCaixas';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { listaDefeitos } from 'src/app/repositories/listaDefeitos';

declare var $: any;

@Component({
  selector: 'app-defeito',
  templateUrl: './defeito.component.html',
  styleUrls: ['./defeito.component.css']
})
export class DefeitoComponent {
  constructor(
    private defeitoService: DefeitoService,
    private router:Router,
    private modalService: BsModalService
    ){}

  usuario='';
  propriedade='';

  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;

  modalRef!: BsModalRef;
  defeitos: Defeito[]=[];

  motivos:MotivoDefeito ={pedTampered:'',
  erroNaLeituraDoCartao:'',
  touch:'',
  conectorComDefeito:'',
  conectividadeDeChips:'',
  estetica:'',
  defeitoDeImpressao:'',
  teclado:'',
  telaQuebrada:'',
  total:''};

  listaCaixas:string[] = listaCaixas;
  selectedSerial='';
  novoMotivo='';
  caixa='';
  selectedOpcao = '';
  listaDefeitos=listaDefeitos

  ngOnInit(){
    this.getDefeito();
    this.getMotivos();
  }

  getDefeito(){
    this.defeitoService.getDefeito().subscribe({
      next: (d) =>{
        this.defeitos=d;
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

  getMotivos(){
    this.defeitoService.getMotivos().subscribe({
      next: (m)=>{this.motivos=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  alterarMotivo(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "novoMotivo": this.novoMotivo,
      "usuario":this.usuario
    });
    this.defeitoService.alterarMotivo(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const defeito = $('#tabela-defeito').DataTable()
        defeito.destroy();
        this.ngOnInit();
      },
      error: (error)=>{
        this.fechaModal();
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  moverParaDevolucao(){
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "caixa": this.caixa,
      "usuario":this.usuario
    });
    this.defeitoService.moverParaDevolucao(params).subscribe({
      next: ()=>{
        this.fechaModal();
        const defeito = $('#tabela-defeito').DataTable()
        defeito.destroy();
        this.ngOnInit();
      },
      error: (error)=>{
        this.fechaModal();
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  initDataTable() {
    $(document).ready(() => {
      const defeito = $('#tabela-defeito').DataTable({
        data: this.defeitos,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'caixa' },
          { data: 'motivo' },
          { data: 'data' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      $('#tabela-defeito tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = defeito.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.openModalOpcoes(rowData.serial);
        }
      });
    });
  }

  onSubmit(){
    if(this.selectedOpcao == 'alterarMotivo'){
      this.alterarMotivo();
    }

    else if(this.selectedOpcao == 'moverParaDevolucao'){
      this.moverParaDevolucao()
    }
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
    this.novoMotivo=''
    this.propriedade=''
    this.caixa=''
  }
}
