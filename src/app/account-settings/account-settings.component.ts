import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {
  user = { email: '', password: '' };
  createFlow = true;
  stripe;
  card;

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit() {
    this.user.email = this.appService.getUser();
    if (this.user.email !== null) {
      this.createFlow = false;
    }

    // Create a Stripe client.
    this.stripe = Stripe('pk_test_IyAbAxs0SDqwmt1OkUHz3diy');
  }

  ngAfterViewInit() {
    // Create an instance of Elements.
    var elements = this.stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#CFD7DF'
        },
        ':-webkit-autofill': {
          color: '#e39f48'
        }
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5'
        }
      }
    };

    // Create an instance of the card Element.
    var card = elements.create('card', { style: style });

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    this.card = card;
  }

  createUser() {
    this.appService.createUser(this.user).subscribe(res => {
      this.appService.setUser(this.user.email);
      console.log(res);
      this.appService.setToken(res['token']);
      this.router.navigateByUrl('/calendar');
    });
  }

  // TODO clean this method up
  submitPayment() {
    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
        // Inform the user if there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = '';
        // Send the token to your server.
        this.appService.pay(result.token).subscribe(res=> {
          console.log(res);
        });
        console.log(result.token);
      }
    });
  }
}
