import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit {

  user;
  constructor(private appService:AppService) { }

  ngOnInit() {
    this.user = this.appService.getUser();
  }

}
