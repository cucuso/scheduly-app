import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppService } from './app.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public appService: AppService, public router: Router) { }
    canActivate(): boolean {
        if (!this.appService.getToken()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}