import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
        });
    }

    loginUser() {
        this.appService.loginUser(this.userForm.value).subscribe(res => {
            this.appService.setToken(res['token']);

            this.appService.retrieveUserApptsFromServer().subscribe(res => {
                this.appService.saveAppts(res);
                this.router.navigateByUrl('/');
            })
        });
    }

    goToSignup() {
        this.router.navigateByUrl('/signup');
    }
}
