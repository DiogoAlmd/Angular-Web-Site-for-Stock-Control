import { Component,TemplateRef, ViewChild} from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Historico } from 'src/app/interfaces/historico';
import { HistoricoService } from 'src/app/services/historico.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
declare var $: any;

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent {
  constructor(private userService:UserService, private historicoService: HistoricoService, private router:Router,private modalService: BsModalService,){}
  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;

  historico: Historico[]=[]
  id=''
  selectedSerial=''
  origem=''
  destino=''
  modalRef!: BsModalRef;
  usuario=''
  funcao=''

  ngOnInit(){
    this.verificaToken()
  }

  verificaToken(){
    this.userService.verificaTokenExistente().subscribe({
      next:()=>{
        let payload = getUserInfo();
        if(payload!==undefined){
          this.usuario=payload.unique_name;
          this.funcao=payload.role
          this.getHistorico()
        }
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])}
    })
  }

  getHistorico(){
    this.historicoService.getHistorico(this.funcao,this.usuario).subscribe({
      next: (h) =>{this.historico=h;
      this.initDataTable()},
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaHistorico = $('#tabela-historico').DataTable({
        data: this.historico,
        columns: [
          { data: 'id' },
          { data: 'serial' },
          { data: 'origem' },
          { data: 'destino' },
          { data: 'usuario' },
          { data: 'status' },
          { data: 'situacao' },
          { data: 'local' },
          { data: 'operadora' },
          { data: 'dataRetirada' },
          { data: 'maquinaPropriaDoCliente' },
          { data: 'caixa' },
          { data: 'motivo' },
          { data: 'data' },
          { data: 'cnpf' },
          { data: 'empresa' },
          { data: 'dataAlteracao' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      // Adicione o evento de clique ao botão "botaoEditar"
      $('#tabela-historico tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaHistorico.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.id=rowData.id;
          this.origem=rowData.origem;
          this.destino=rowData.destino;
          this.openModalOpcoes(rowData.serial);
        }
      });
    });
  }

  openModalOpcoes(serial: string) {
    this.modalRef = this.modalService.show(this.modalOpcoes);
  }

  desfazerHistorico(){
    this.historicoService.desfazerHistorico(this.id,this.selectedSerial,this.origem,this.destino).subscribe({
      next: () =>{this.modalService.hide();
                  const tabelaHistorico = $('#tabela-historico').DataTable();
                  tabelaHistorico.destroy();
                  this.ngOnInit()},
      error: (error) =>{
        this.modalService.hide();
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }
}
