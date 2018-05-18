import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable()
export class AppService {
  configUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  public getUser() {
    return this.localStorage.retrieve('email');
  }

  public setUser(email) {
    this.localStorage.store('email', email);
  }

  public getToken() {
    return this.localStorage.retrieve('token');
  }

  public setToken(token) {
    this.localStorage.store('token', token);
  }

  public removeUser() {
    this.localStorage.clear('email');
    this.localStorage.clear('token');
  }

  public createUser(user) {
    return this.http.post(this.configUrl + '/signup', user);
  }

  public pay(paymentInfo) {
    return this.http.post(this.configUrl + '/pay',  paymentInfo, {
      headers: { Authorization: 'Bearer ' +  this.getToken() }
    });
  }
}
