import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Devolucao } from 'src/app/interfaces/devolucao';
import { Modelos } from 'src/app/interfaces/modelos';
import { DevolucaoService } from 'src/app/services/devolucao.service';
declare var $: any;

@Component({
  selector: 'app-devolucao',
  templateUrl: './devolucao.component.html',
  styleUrls: ['./devolucao.component.css']
})
export class DevolucaoComponent {
  constructor(private devolucaoService: DevolucaoService, private router:Router){}

  devolucoes: Devolucao[]=[]
  modelos:Modelos ={d3Pro1:'',d3Pro2:'',d3ProRefurbished:'',d3Smart:'',d3TEF:'',d3X:'',d3FIT:'',total:''};

  ngOnInit(){
    this.getDevolucao();
    this.getModelos();
  }

  getDevolucao(){
    this.devolucaoService.getDevolucao().subscribe({
      next: (d) =>{
        this.devolucoes=d;
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
    this.devolucaoService.getModelos().subscribe({
      next: (m)=>{this.modelos=m[0]},
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
      const tabelaDevolucoes = $('#tabela-devolucao').DataTable({
        data: this.devolucoes,
        columns: [
          { data: 'serial' },
          { data: 'modelo' },
          { data: 'caixa' },
          { data: 'data' },
        ]
      });})}
}
