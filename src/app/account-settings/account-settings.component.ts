import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {
  user = { email: ''};
  expDate;
  accountType;
  userForm: FormGroup;
  createFlow = true;
  accountSettingsFlow = false;
  loginFlow = false;
  sign;
  stripe;
  card;

  constructor(private router: Router, private appService: AppService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user.email = this.appService.getUser();
    console.log( this.appService.getExpDate());
    this.expDate = this.appService.getExpDate();

     if(this.expDate === undefined) {
       this.accountType = 'FREE';
     } else if(new Date(this.expDate) < new Date()){
      this.accountType = 'EXPIRED';
     }else if(new Date(this.expDate) > new Date()){
      this.accountType = 'CURRENT';
     }


    if (this.user.email !== null) {
      this.createFlow = false;
      this.accountSettingsFlow = true;
      // TODO change this to prod Create a Stripe client.
      this.stripe = Stripe('pk_test_IyAbAxs0SDqwmt1OkUHz3diy');
    } else {
      this.createForm();
    }
  }

  createForm() {
    this.userForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    if (this.accountSettingsFlow === true) {
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
      if(this.accountType !== 'CURRENT'){
      card.mount('#card-element');

      this.card = card;
      }
    }
  }

  createUser() {
    this.appService.createUser(this.userForm.value).subscribe(res => {
      this.appService.setUser(this.userForm.get('email').value);
      this.appService.setToken(res['token']);
      this.router.navigateByUrl('/calendar');
    });
  }

  loginUser() {
    this.appService.loginUser(this.userForm.value).subscribe(res => {
      this.appService.setUser(this.userForm.get('email').value);
      this.appService.setToken(res['token']);
    

      this.appService.retrieveUserApptsFromServer().subscribe(res=> 
        {
          this.appService.saveAppts(res);
          this.router.navigateByUrl('/calendar');
        })
    });
  }

  goToCreate() {
    this.createFlow = true;
    this.accountSettingsFlow = false;
    this.loginFlow = false;
  }

  goToLogin() {
    this.createFlow = false;
    this.accountSettingsFlow = false;
    this.loginFlow = true;
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
         
          this.appService.setExpDate(res['expirationDate']);
          this.expDate = res['expirationDate'];
          this.accountType = 'CURRENT';
          
        });
      }
    });
  }
}
