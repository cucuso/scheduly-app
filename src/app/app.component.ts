import { Component } from '@angular/core';
import { AppService } from './service/app.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent{
  constructor(private router: Router, route:ActivatedRoute, private appService:AppService){
    // route.params.subscribe(val => {
    //   let token = this.appService.getToken();
    //   if(!token){
    //     this.router.navigateByUrl("/login");
    //   } else {
    //     this.router.navigateByUrl("/");
    //   }
    // });
  }
}
