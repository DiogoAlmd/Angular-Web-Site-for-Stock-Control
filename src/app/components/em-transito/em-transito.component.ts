import { Component, TemplateRef, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { Solicitacao } from 'src/app/interfaces/solicitacao';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';
import { UserService } from 'src/app/services/user.service';
import { EmTransitoService } from 'src/app/services/em-transito.service';
import { EmTransito } from 'src/app/interfaces/emTransito';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-em-transito',
  templateUrl: './em-transito.component.html',
  styleUrls: ['./em-transito.component.css']
})
export class EmTransitoComponent {

  constructor(private emTransitoService:EmTransitoService , private userService:UserService, private solicitacaoService:SolicitacaoService, private router:Router, private modalService: BsModalService){}
  @ViewChild('modalExclusao') modalExclusao!: TemplateRef<any>;
  @ViewChild('modalStore') modalStore!: TemplateRef<any>;
  @ViewChild('form') form!: NgForm;
  
  modalRef!: BsModalRef;
  modalRef2!: BsModalRef;
  usuario=''
  solicitacao:Solicitacao[]=[]
  groupid=''
  funcao=''
  selectedId=''
  selectedSerial=''
  emTransito:EmTransito[]=[]
  selectedOpcao=''
  situacao=''
  local=''
  codigo=''
  storeDestino=''


  ngOnInit(){
    this.verificaToken()
  }

  verificaToken(){
    this.userService.verificaTokenExistente().subscribe({
      next:()=>{
        let payload = getUserInfo();
        if(payload!==undefined){
          this.usuario=payload.unique_name;
          this.groupid=payload.groupsid;
          this.funcao=payload.role;
          this.getSolicitacao()
          this.getEmTransito()
        }
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])}
    })
  }

  getSolicitacao(){
    this.solicitacaoService.getSolicitacao(this.groupid).subscribe({
      next: (s) =>{
        this.solicitacao=s;
        this.initDataTable1();
        },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });
  }

  getEmTransito(){
    this.emTransitoService.getEmTransito(this.groupid,this.usuario).subscribe({
      next: (eT) =>{
        this.emTransito=eT;
        this.initDataTable2();
        },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });
  }

  initDataTable1() {
    $(document).ready(() => {
      const tabelaSolicitacao = $('#tabela-Solicitacao').DataTable({
        data: this.solicitacao,
        columns: [
          { data: 'id' },
          { data: 'usuario' },
          { data: 'store' },
          { data: 'modelo' },
          { data: 'quantidade' },
          { data: 'enviadas' },
          { data: 'recebidas' },
          { data: 'data' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      $('#tabela-Solicitacao tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaSolicitacao.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedId = rowData.id;
          if(this.funcao=='CONSULTOR' || this.funcao=='ADMIN')
            this.openModalOpcoes1(rowData.id);
        }
      });
    });
  }

  openModalOpcoes1(serial: string) {
    this.modalRef = this.modalService.show(this.modalExclusao);
  }

  deleteSolicitacao(){
    this.solicitacaoService.deleteSolicitacao(this.selectedId).subscribe({
      next: () =>{
        this.fechaModal()
        const tabelaSolicitacao = $('#tabela-Solicitacao').DataTable();
        tabelaSolicitacao.destroy();
        const tabelaEmTransito = $('#tabela-EmTransito').DataTable();
        tabelaEmTransito.destroy();
        this.ngOnInit()
        },
      error: (error) =>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
        else if(error.status==422)
          alert('Não é possível apagar solicitação com maquininha em trânsito')
      }
    });
  }

  initDataTable2() {
    $(document).ready(() => {
      const tabelaEmTransito = $('#tabela-EmTransito').DataTable({
        data: this.emTransito,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'operadora' },
          { data: 'destino' },
          { data: 'remetente' },
          { data: 'dataEnvio' },
          { data: 'transporte' },
          { data: 'lote' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar2"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      $('#tabela-EmTransito tbody').on('click', '#botaoEditar2', (event: Event) => {
        const rowData = tabelaEmTransito.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.storeDestino=rowData.destino;
            this.openModalOpcoes2(rowData.serial);
        }
      });
    });
  }

  openModalOpcoes2(serial: string) {
    this.modalRef2 = this.modalService.show(this.modalStore);
  }

  moverParaStore(){
    if(this.storeDestino=='MTZ'){
      alert('Só é possível enviar essa máquina para a MTZ');
      return;
    }
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario": this.usuario,
    });
    this.emTransitoService.moverParaStore(params).subscribe({
      next: () =>{
        this.fechaModal()
        const tabelaSolicitacao = $('#tabela-Solicitacao').DataTable();
        tabelaSolicitacao.destroy();
        const tabelaEmTransito = $('#tabela-EmTransito').DataTable();
        tabelaEmTransito.destroy();
        this.ngOnInit()
        },
      error: (error) =>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
        else if(error.status==409)
          alert(error.error.message)
      }
    })
  }

  moverParaArmario2(){
    if(this.storeDestino!='MTZ'){
      alert('Só é possível enviar essa máquina para a Store');
      this.fechaModal();
      return;
    }
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "situacao":this.situacao,
      "local":this.local,
      "usuario": this.usuario,
    });
    this.emTransitoService.moverParaArmario2(params).subscribe({
      next: () =>{
        this.fechaModal()
        const tabelaSolicitacao = $('#tabela-Solicitacao').DataTable();
        tabelaSolicitacao.destroy();
        const tabelaEmTransito = $('#tabela-EmTransito').DataTable();
        tabelaEmTransito.destroy();
        this.ngOnInit()
        },
      error: (error) =>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  alterarCodigo(){
    if(this.funcao=='CONSULTOR'&&this.storeDestino!='MTZ')
    {
      alert("Não é possível alterar código de serial enviado pela MTZ!")
      this.fechaModal()
      return
    }
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "novoMotivo":this.codigo,
      "usuario": this.usuario,
    });
    this.emTransitoService.alterarCodigo(params).subscribe({
      next: () =>{
        this.fechaModal()
        const tabelaSolicitacao = $('#tabela-Solicitacao').DataTable();
        tabelaSolicitacao.destroy();
        const tabelaEmTransito = $('#tabela-EmTransito').DataTable();
        tabelaEmTransito.destroy();
        this.ngOnInit()
        },
      error: (error) =>{
        this.fechaModal()
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }


  fechaModal(){
    this.modalService.hide()
    this.resetaCampos()
    this.selectedOpcao = ''
  }

  resetaCampos(){
    this.situacao=''
    this.local=''
    this.codigo=''
  }

  onSubmit(){
   if(this.selectedOpcao == 'moverParaStore'){
    this.moverParaStore();
   }

   else if(this.selectedOpcao == 'moverParaArmario2'){
    this.moverParaArmario2();
   }
   else if(this.selectedOpcao == 'alterarCodigo'){
    this.alterarCodigo();
   }
  }
}
