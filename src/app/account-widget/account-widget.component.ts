import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css'],
  host: {
    '(document:click)': 'handleClick($event)'
  }
})
export class AccountWidgetComponent implements OnInit {
  userEmail;
  showMenu: boolean = false;
  public elementRef;

  

  constructor(private router: Router, private appService: AppService, myElement: ElementRef) {
    this.elementRef = myElement;
  }

  ngOnInit() {
    this.userEmail = this.appService.getUserEmail();
  }

  handleClick(event) {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.showMenu = false;
    }
  }

  signout() {
    this.appService.removeUser();
    this.appService.clearAppts();
    this.router.navigateByUrl("/logout");
  }

  goToAccountSettings() {
    this.router.navigateByUrl("/account-settings");
  }

  goToAbout() {
    this.router.navigateByUrl("/about");
  }
}
