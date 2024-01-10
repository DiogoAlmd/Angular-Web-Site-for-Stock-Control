import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ohno',
  templateUrl: './ohno.component.html',
  styleUrls: ['./ohno.component.css']
})
export class OhnoComponent {
  message: string = '';
  error:string='';

  constructor (private activatedRoute: ActivatedRoute, private router:Router) {}

  ngOnInit() {
    this.error = this.activatedRoute.snapshot.paramMap.get('message') || '';
    if(this.error=='401')
      this.message='ACESSO NEGADO!'
    else if(this.error=='500')
      this.message='FALHA NO SERVIDOR!'
      else if(this.error=='404')
      this.message='PÁGINA NÃO ENCONTRADA!'
  }

  goHome(){
    this.router.navigate(['sistema'])
    }

}
