import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private location:Location, private userService:UserService, private router:Router){}

  message=''

  ngOnInit(){
    this.userService.verificaTokenExistente().subscribe({
      next: () => {
        this.message='Deseja realmente sair?';
      },
      error: (error) =>{
        if(error.status==401 || error.status==403)
          this.router.navigate(['ohno', '401'])
        else if(error.status==500)
          this.router.navigate(['ohno','500'])
      }
    });
  }

  goBack(){
    this.location.back()
  }

  sair(){
    localStorage.removeItem("token");
    this.message='Sessão Encerrada!'
  }

  login(){
    this.router.navigate(['login'])
  }
}
