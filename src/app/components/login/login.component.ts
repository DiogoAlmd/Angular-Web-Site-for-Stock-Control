import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario : Usuario = {Login:'', Senha:'', Funcao:'', Store:''}
  mensagemErro?:string
  constructor(private userservice:UserService, private router:Router, private userService:UserService){}

  ngOnInit(){
    this.userService.verificaTokenExistente().subscribe({
      next: () =>{this.router.navigate(['sistema'])
      },
      error: (error) =>{
      }
    });
  }

  onSubmit(form:NgForm){
    this.generateToken()
  }

  generateToken(){
    this.userservice.login(this.usuario).subscribe({
      next: (t)=>{localStorage.setItem ('token',t.token),
                  this.router.navigate(['sistema'])},
      error: (error)=>{
        if(error.status==404)
          this.mensagemErro="Usuário ou senha incorretos!"
        else if(error.status==500)
          this.mensagemErro="Falha no servidor, tente novamente!"
      }
    })
  }

 

  }

