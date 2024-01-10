import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MaquinasNosClientes } from 'src/app/interfaces/maquinasNosClientes';
import { Modelos } from 'src/app/interfaces/modelos';
import { cidades } from 'src/app/repositories/cidadesStore';
import { getUserInfo } from 'src/app/repositories/getUserInfo';
import { MaquinasNosClientesService } from 'src/app/services/maquinas-nos-clientes.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { carteiras } from 'src/app/repositories/carteiras';

declare var $: any;

@Component({
  selector: 'app-no-cliente',
  templateUrl: './no-cliente.component.html',
  styleUrls: ['./no-cliente.component.css']
})
export class NoClienteComponent {
  constructor(private userService:UserService , private maquinasNosClientesService: MaquinasNosClientesService, private router:Router, private modalService:BsModalService){}
  @ViewChild('form') form!: NgForm;
  @ViewChild('form2') form2!: NgForm;
  @ViewChild('modalOpcoes') modalOpcoes!: TemplateRef<any>;
  @ViewChild('modalLote') modalLote!: TemplateRef<any>;
  modalRef!: BsModalRef;
  maquinasNosClientes: MaquinasNosClientes[]=[]
  modelosTotal:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  modelosEntreDatas:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};
  dataAtual = new Date();
  ultimoDiaDoMes = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 0);
  dataFinalPadrao = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), this.ultimoDiaDoMes.getDate());
  dataInicialPadrao = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), 1);
  dataInicialFormatada = this.dataInicialPadrao.toISOString().slice(0, 10);
  dataFinalFormatada = this.dataFinalPadrao.toISOString().slice(0, 10);
  dataInicial=this.dataInicialFormatada
  dataFinal=this.dataFinalFormatada
  selectedSerial=''
  situacao=''
  usuario=''
  selectedOpcao = ''
  cidadesStores=cidades
  funcao=''
  groupid=''
  transporte=''
  codigo=''
  empresa=''
  cnpf=''
  selectedStore=''
  local='NA'
  serial=''
  carteiras:string[]=carteiras

  ngOnInit(){
    this.verificaToken();
    
  }


  verificaToken(){
    this.userService.verificaTokenExistente().subscribe({
      next:()=>{
        let payload = getUserInfo();
        if(payload!==undefined){
          this.usuario=payload.unique_name;
          this.groupid=payload.groupsid
          this.funcao=payload.role
          this.getMaquinasNosClientes();
          this.getModelosTotal();
          this.getModelosEntreDatas();
        }
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])}
    })
  }

  getMaquinasNosClientes(){
    this.maquinasNosClientesService.getMaquinasNosClientes(this.groupid).subscribe({
      next: (mnc) =>{
        this.maquinasNosClientes=mnc;
        this.initDataTable();
        let payload = getUserInfo();
        if(payload!==undefined)
        {
          this.usuario=payload.unique_name;
          this.funcao=payload.role;
          this.groupid=payload.groupsid;
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

  getModelosTotal(){
    this.maquinasNosClientesService.getModelosTotal(this.groupid).subscribe({
      next: (m)=>{this.modelosTotal=m[0]},
      error: (error)=>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    })
  }

  getModelosEntreDatas(){
    this.maquinasNosClientesService.getModelosEntreDatas(this.dataInicial,this.dataFinal,this.groupid).subscribe({
      next: (m)=>{this.modelosEntreDatas=m[0]},
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
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario":this.usuario,
      "transporte":this.transporte
    });
    this.maquinasNosClientesService.moverParaEmTransito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaNoCliente = $('#tabela-noCliente').DataTable();
        tabelaNoCliente.destroy();
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

  moverParaStore(){
    if(this.local=='NA')
      this.local=this.selectedStore
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario":this.usuario,
      "local":this.local
    });
    this.maquinasNosClientesService.moverParaStore(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaNoCliente = $('#tabela-noCliente').DataTable();
        tabelaNoCliente.destroy();
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

  moverParaStoreDefeito(){
    if(this.local=='NA')
      this.local=this.selectedStore
    console.log(this.local)
    let params = JSON.stringify({
      "serial": this.selectedSerial,
      "usuario":this.usuario,
      "local":this.local
    });
    this.maquinasNosClientesService.moverParaStoreDefeito(params).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaNoCliente = $('#tabela-noCliente').DataTable();
        tabelaNoCliente.destroy();
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

  migracaoCadastro(){
    this.maquinasNosClientesService.migracaoCadastro(this.selectedSerial,this.cnpf,this.empresa,this.usuario,this.local).subscribe({
      next: ()=>{
        this.fechaModal()
        const tabelaNoCliente = $('#tabela-noCliente').DataTable();
        tabelaNoCliente.destroy();
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

  encerraEvento(){
    this.maquinasNosClientesService.encerraEvento(this.serial,this.usuario).subscribe({
      next: (res)=>{
        alert(res.res)
        this.fechaModal()
        const tabelaNoCliente = $('#tabela-noCliente').DataTable();
        tabelaNoCliente.destroy();
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
        else if(error.status==422){
          alert('Não é possível encerrar esse evento automaticamente, pois ele é antigo e não possui data de envio. A operação deve ser feita manualmente em cada serial na tabela.')
          this.fechaModal()
        }
      }
    })
  }

  initDataTable() {
    $(document).ready(() => {
      const tabelaNoCliente = $('#tabela-noCliente').DataTable({
        data: this.maquinasNosClientes,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'cnpf' },
          { data: 'empresa' },
          { data: 'store'},
          { data: 'data' },
          {
            data: null,
            render: () => {
              return `<button id="botaoEditar"><img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" width='20vu' height="auto"></button>`
            }
          }
        ]
      });

      // Adicione o evento de clique ao botão "botaoEditar"
      $('#tabela-noCliente tbody').on('click', '#botaoEditar', (event: Event) => {
        const rowData = tabelaNoCliente.row($(event.target).closest('tr')).data();
        if (rowData) {
          this.selectedSerial = rowData.serial;
          this.selectedStore=rowData.store;
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
    this.transporte=''
    this.codigo=''
    this.empresa=''
    this.cnpf=''
    this.local='NA'
    this.serial=''
  }

  onSubmit(){
    if(this.selectedOpcao == 'moverParaStore'){
      this.moverParaStore();
    }
    else if(this.selectedOpcao == 'moverParaEmTransito'){
      this.moverParaEmTransito();
    }
    else if(this.selectedOpcao=='moverParaStoreDefeito')
      this.moverParaStoreDefeito();
    else if(this.selectedOpcao=='migracaoDeCadastro')
    this.migracaoCadastro();
  }

  onSubmit2(){
    this.encerraEvento()
  }

  abreModal(){
    this.modalService.show(this.modalLote);
  }
}
