import { Component, TemplateRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { appointments } from './appointments.model';
import { Appointment } from './appointment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // TODO deal with years, now if you put event in 2018 will show for 2017

  // Needed to iterate over keys which are the days in each month
  Object = Object;
  modalRef: BsModalRef;

  // TODO convert to pipe
  monthsTxt = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysTxt = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  today: number = Date.now();
  // TODO look into this day of month only being used for bg
  dayOfMonth = moment(this.today).date();
  currentMonth = moment(this.today).month();

  month = this.currentMonth;
  year = 2018;
  day = 1;
  mytime: Date = new Date();

  appointments = appointments;
  appointment = <Appointment>{};

  searchDomain = [];
  searchResults = [];
  showResults = false;
  searchParam;

  submitted = false;

  constructor(private modalService: BsModalService) {}

  // Check only when no input is selected
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key == 'ArrowLeft' && event.srcElement.localName == 'body') {
      this.decreaseMonth();
    } else if (event.key == 'ArrowRight' && event.srcElement.localName == 'body') {
      this.increaseMonth();
    }
  }

  openModal(template: TemplateRef<any>, month, day) {
    this.modalRef = this.modalService.show(template);
    this.month = month;
    this.day = day;
  }

  saveAppt() {
    this.appointments[this.month][this.day].push(this.appointment);
    this.searchDomain.push({ date: this.month + 1 + '/' + this.day + '/' + this.year, text: JSON.stringify(this.appointment.title + this.appointment.description) });
    this.appointment = <Appointment>{};
    this.modalRef.hide();
  }

  // Todo have to remove from view and search results and search set
  removeAppt(month, day, appt) {
    this.appointments[month][day].splice(appt, 1);
    this.modalRef.hide();
  }

  searchAppts(input) {
    this.searchResults = this.searchDomain.filter(appt => appt.text.toLowerCase().includes(input.toLowerCase()));
    this.showResults = true;
    this.searchParam = input;
  }

  increaseMonth() {
    if (this.month == 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
  }

  decreaseMonth() {
    if (this.month == 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
  }
}
