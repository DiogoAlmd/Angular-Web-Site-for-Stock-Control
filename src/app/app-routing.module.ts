import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SistemaComponent } from './components/sistema/sistema.component';
import { Armario1Component } from './components/armario1/armario1.component';
import { Armario2Component } from './components/armario2/armario2.component';
import { Armario3Component } from './components/armario3/armario3.component';
import { EstoqueABComponent } from './components/estoque-ab/estoque-ab.component';
import { NoClienteComponent } from './components/no-cliente/no-cliente.component';
import { StoreComponent } from './components/store/store.component';
import { StoreDefeitoComponent } from './components/store-defeito/store-defeito.component';
import { DefeitoComponent } from './components/defeito/defeito.component';
import { DevolucaoComponent } from './components/devolucao/devolucao.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { OhnoComponent } from './components/ohno/ohno.component';
import { LogoutComponent } from './components/logout/logout.component';
import { EmTransitoComponent } from './components/em-transito/em-transito.component';

const routes: Routes = [
  {path:'',redirectTo:'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'sistema', component:SistemaComponent,
    children: [
      {path: 'armario1', component:Armario1Component},
      {path: 'armario2', component:Armario2Component},
      {path: 'armario3', component:Armario3Component},
      {path: 'estoqueAB', component:EstoqueABComponent},
      {path: 'noCliente', component:NoClienteComponent},
      {path: 'store', component:StoreComponent},
      {path: 'storeDefeito', component:StoreDefeitoComponent},
      {path: 'defeito', component:DefeitoComponent},
      {path: 'devolucao', component:DevolucaoComponent},
      {path: 'historico', component:HistoricoComponent},
      {path: 'emTransito', component:EmTransitoComponent}
    ]},
  {path: 'ohno/:message', component:OhnoComponent},
  {path: 'logout', component:LogoutComponent},
  {path:'**', redirectTo:'ohno/404', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
