import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {
  user = { email: '', password: '' };

  constructor(private router: Router, private appService: AppService) {}

  onSubmit() {
    this.appService.createUser(this.user).subscribe(res => {
      this.appService.setUser(this.user.email);
      this.router.navigateByUrl("/calendar");
    });
  }
}
