import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    userForm: FormGroup;

    constructor(private router: Router, private appService: AppService, private fb: FormBuilder) { }

    ngOnInit() {
        if (this.appService.getToken()) {
            this.router.navigateByUrl('/');
        }
        this.createForm();
    }

    createForm() {
        this.userForm = this.fb.group({
            companyName: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
        });
    }

    createUser() {
        this.appService.createUser(this.userForm.value).subscribe(res => {
            this.appService.setToken(res['token']);
            this.router.navigateByUrl('/');
        });
    }

    goToLogin() {
        this.router.navigateByUrl('/login');
    }
}
