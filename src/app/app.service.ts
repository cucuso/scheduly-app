import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
 


@Injectable()
export class AppService {
  
  configUrl = 'http://localhost:8080/signup';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  public getUser() {
    return this.localStorage.retrieve('email');
  }

  public setUser(email) {
    // will return true if successful
    this.localStorage.store('email', email);
  }

  public createUser(user) {
    return this.http.post(this.configUrl, user);
  }
}
