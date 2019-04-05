import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor(private router: Router, route:ActivatedRoute, private appService:AppService){
    route.params.subscribe(val => {
      let token = this.appService.getToken();
      if(!token){
        this.router.navigateByUrl("/account-settings");
      } else {
        this.router.navigateByUrl("/");
      }
    });
  }
}
