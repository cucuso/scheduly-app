import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as SHA3 from 'crypto-js/sha3'

const helper = new JwtHelperService();

@Injectable()
export class AppService {

  configUrl = environment.serviceUrl;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  public getToken() {
    return this.localStorage.retrieve('token');
  }

  public setToken(token) {
    this.localStorage.store('token', token);
  }

  public removeUser() {
    this.localStorage.clear('token');
  }

  public getAppts() {
    return this.localStorage.retrieve('appts');
  }

  public saveAppts(appointments) {
    this.localStorage.store('appts', appointments);
  }

  public getApptsSearchDomain() {
    return this.localStorage.retrieve('searchDomain');
  }

  public saveApptsSearchDomain(searchDomain) {
    this.localStorage.store('searchDomain', searchDomain);
  }

  public clearAppts() {
    this.localStorage.clear('appts');
    this.localStorage.clear('searchDomain');
  }

  public createUser(user) {
    let userWIthHashPassword = { ... user };
    userWIthHashPassword.password = SHA3(user.password).toString();
    return this.http.post(this.configUrl + '/signup', userWIthHashPassword);
  }

  public loginUser(user) {
    let userWIthHashPassword = { ... user };
    userWIthHashPassword.password = SHA3(user.password).toString();
    return this.http.post(this.configUrl + '/login', userWIthHashPassword);
  }

  public pay(paymentInfo) {
    return this.http.post(this.configUrl + '/pay', paymentInfo, {
      headers: { Authorization: 'Bearer ' + this.getToken() }
    });
  }

  public updateAppointments(appointments) {
    return this.http.put(this.configUrl + '/appointments', appointments, {
      headers: { Authorization: 'Bearer ' + this.getToken() }
    });
  }

  public retrieveUserApptsFromServer() {
    return this.http.get(this.configUrl + '/appointments', {
      headers: { Authorization: 'Bearer ' + this.getToken() }
    });
  }

  public getUserEmail(): string {
    if (this.getToken() != null) {
      const decodedToken = helper.decodeToken(this.getToken());
      return decodedToken.email;
    } else {
      return null;
    }
  }

  public getCompanyName(): string {
    if (this.getToken() != null) {
      const decodedToken = helper.decodeToken(this.getToken());
      return decodedToken.companyName;
    } else {
      return null;
    }
  }

  public getExp() {
    return this.http.get(this.configUrl + '/expiration', {
      headers: { Authorization: 'Bearer ' + this.getToken() }
    });
  }
}
