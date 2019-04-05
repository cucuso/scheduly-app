import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AccountWidgetComponent } from './account-widget/account-widget.component';
import { AppService } from './app.service';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
  { path: 'account-settings', component: AccountSettingsComponent },
  { path: '', component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [AppComponent, AccountSettingsComponent, CalendarComponent, AccountWidgetComponent, AboutComponent],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2Webstorage
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
