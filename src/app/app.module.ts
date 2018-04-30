import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

import { ModalModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AccountWidgetComponent } from './account-widget/account-widget.component';
import { AppService } from './app.service';

const appRoutes: Routes = [
  { path: 'account-settings', component: AccountSettingsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [AppComponent, AccountSettingsComponent, CalendarComponent, AccountWidgetComponent],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    Ng2Webstorage
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
