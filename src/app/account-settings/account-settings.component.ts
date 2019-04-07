import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  user = { email: '' };
  expDate: Date;
  accountType;
  userForm: FormGroup;
  sign;
  stripe;
  card;

  constructor(private router: Router, private appService: AppService, private fb: FormBuilder) { }

  ngOnInit() {
    this.user.email = this.appService.getUserEmail();

    if (this.user.email !== null) {
      this.appService.getExp().subscribe((res) => {

        this.expDate = new Date(res.toString());
        if (new Date(this.expDate) < new Date()) {
          this.accountType = 'EXPIRED';
        } else if (new Date(this.expDate) > new Date()) {
          this.accountType = 'CURRENT';
        }
      }, err => {
        console.error(err);
        this.appService.removeUser();
        this.router.navigate['/'];
      });

      // TODO change this to prod Create a Stripe client.
      this.stripe = Stripe('pk_test_IyAbAxs0SDqwmt1OkUHz3diy');
    }
  }

  // TODO clean this method up
  submitPayment() {
    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        // Inform the user if there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = '';
        // Send the token to your server.
        this.appService.pay(result.token).subscribe(res => {

        });
      }
    });
  }
}
