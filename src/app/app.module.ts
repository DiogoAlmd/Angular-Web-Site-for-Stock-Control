import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
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
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './components/logout/logout.component';
import { NgxMaskModule } from 'ngx-mask';
import { EmTransitoComponent } from './components/em-transito/em-transito.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SistemaComponent,
    Armario1Component,
    Armario2Component,
    Armario3Component,
    EstoqueABComponent,
    NoClienteComponent,
    StoreComponent,
    StoreDefeitoComponent,
    DefeitoComponent,
    DevolucaoComponent,
    HistoricoComponent,
    OhnoComponent,
    LogoutComponent,
    EmTransitoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
