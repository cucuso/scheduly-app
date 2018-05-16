import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  user = { email: '', password: '' };
  createFlow = true;

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit() {
    this.user.email = this.appService.getUser();
    if (this.user.email !== null) {
      this.createFlow = false;
    }
  }

  onSubmit() {
    this.appService.createUser(this.user).subscribe(res => {
      this.appService.setUser(this.user.email);
      this.router.navigateByUrl('/calendar');
    });
  }

  close() {
    this.router.navigateByUrl('/calendar');
  }
}
