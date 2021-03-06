import * as Hammer from 'hammerjs';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule, TimepickerModule, TooltipModule, ButtonsModule } from 'ngx-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AccountWidgetComponent } from './account-widget/account-widget.component';
import { AppService } from './service/app.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService } from './service/auth.service';

const appRoutes: Routes = [
  { path: 'settings', component: AccountSettingsComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: CalendarComponent, canActivate: [AuthGuardService] }
];
export class HammerConfig extends HammerGestureConfig {
  overrides = <any> {
      'pinch': { enable: false },
      'rotate': { enable: false }
  }
}

@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, AccountSettingsComponent, CalendarComponent, AccountWidgetComponent],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2Webstorage,
    ButtonsModule
  ],
  providers: [AppService, AuthGuardService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
