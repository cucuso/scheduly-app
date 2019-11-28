import { Component, OnInit, TemplateRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var Stripe: any;

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {

  modalRef: BsModalRef;
  user = { email: '', companyName: '' };
  expDate: Date;
  accountType;
  userForm: FormGroup;
  sign;
  stripe;
  elements;
  card;
  companyNameUpdated = false;
  uncheckableRadioModel = 'month';
  paymentSuccess = false;

  constructor(private router: Router, private appService: AppService, private modalService: BsModalService, ) { }

  ngOnInit() {
    this.user.email = this.appService.getUserEmail();
    this.user.companyName = this.appService.getCompanyName();

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


    }
  }

  ngAfterViewInit() {

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // TODO change this to prod Create a Stripe client.
    this.stripe = Stripe('pk_live_EYEKI1FU6yLAYGAu6lgFKRd4');
    this.elements = this.stripe.elements();
    // Create an instance of the card Element.
    this.card = this.elements.create('card', style);

    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');
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
        const yearly = this.uncheckableRadioModel === 'year';
        const req = { "id": result.token.id, "yearly": yearly }
        this.appService.pay(req).subscribe(res => {

          this.expDate = new Date(res['expirationDate'].toString());
          this.accountType = 'CURRENT';

        });
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  updateCompanyName() {
    this.appService.updateCompanyName(this.user.companyName).subscribe(
      res => {
        this.companyNameUpdated = true;
        this.appService.refreshToken().subscribe(res => { this.appService.setToken(res['token']); })
      }
    );
  }

  deleteAcct() {
    this.appService.deleteAcct().subscribe();
    this.modalRef.hide();
    this.appService.removeUser();
    this.appService.clearAppts();
    this.router.navigateByUrl("/login");
  }
}
