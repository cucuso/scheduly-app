import { Component, TemplateRef, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { Appointments } from './model/appointments.model';
import { Appointment } from './model/appointment.model';
import { months } from './model/months.model';
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
      let user = this.appService.getUser();
      console.log(user);
      if(!user){
        this.router.navigateByUrl("/account-settings");
      } else {
        this.router.navigateByUrl("/calendar");
      }
    });
  }
}
