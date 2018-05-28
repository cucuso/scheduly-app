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
    return this.http.post(this.configUrl + '/signup', user);
  }

  public loginUser(user) {
    return this.http.post(this.configUrl + '/login', user);
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
}
