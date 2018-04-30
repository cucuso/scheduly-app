import { Component, TemplateRef, HostListener } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { Appointments } from '../model/appointments.model';
import { Appointment } from '../model/appointment.model';
import { months } from '../model/months.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  // Needed to iterate over keys which are the days in each month
  Object = Object;
  modalRef: BsModalRef;

  // TODO convert to pipe
  monthsTxt = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysTxt = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  today: number = Date.now();
  // TODO look into this day of month only being used for bg
  dayOfMonth = moment(this.today).date();
  currentMonth = moment(this.today).month();

  month = this.currentMonth;
  // TODO get this year program
  year = moment(this.today).year();
  day = 1;
  mytime: Date = new Date();

  appointments = { 2018: JSON.parse(JSON.stringify(months)) };
  appointment = <Appointment>{};
  selectedAppt;

  searchDomain = [];
  searchResults = [];
  showResults = false;
  searchParam;

  submitted = false;
  dayOfWeekFirstOfMonth = new Array(moment(this.getSelectedMonth()).day());

  // TODO on ngonit load from previous save
  constructor(private modalService: BsModalService) {}

  // Check only when no input is selected
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft' && event.srcElement.localName == 'body') {
      this.decreaseMonth();
    } else if (event.key == 'ArrowRight' && event.srcElement.localName == 'body') {
      this.increaseMonth();
    } else if ((event.key == 'Delete' || event.key == 'Backspace') && this.selectedAppt) {
      this.removeAppt(this.selectedAppt.month, this.selectedAppt.day, this.selectedAppt.index);
    }
  }
  // Clear selected appointment
  @HostListener('click', ['$event'])
  onClick(event) {
    if (event.srcElement.className != 'card-link') {
      this.selectedAppt = null;
    }
  }

  openModal(template: TemplateRef<any>, month, day) {
    this.modalRef = this.modalService.show(template);
    this.month = month;
    this.day = day;
  }

  saveAppt() {
    this.appointments[this.year][this.month][this.day].push(this.appointment);
    this.appointments[this.year][this.month][this.day].sort((v1, v2) => v1.time - v2.time);
    this.searchDomain.push({
      date: new Date(this.month + 1 + '/' + this.day + '/' + this.year),
      text: JSON.stringify(this.appointment.title + ' ' + this.appointment.description),
      title: this.appointment.title
    });
    this.appointment = <Appointment>{ time: new Date() };
    this.modalRef.hide();
  }

  // Todo have to remove from view and search results and search set
  removeAppt(month, day, index) {
    let indexOfSearch = this.findApptInSearchDomain(month, day, this.appointments[this.year][month][day][index]);
    this.appointments[this.year][month][day].splice(index, 1);
    if (indexOfSearch !== -1) {
      this.searchDomain.splice(indexOfSearch, 1);
    }
    this.modalRef.hide();
  }

  selectAppt(month, day, index) {
    this.selectedAppt = { month: month, day: day, index: index };
  }

  isSelected(month, day, index) {
    return JSON.stringify(this.selectedAppt) == JSON.stringify({ month: month, day: day, index: index });
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
      if (this.appointments[this.year] === undefined) {
        this.appointments[this.year] = JSON.parse(JSON.stringify(months));
      }
    } else {
      this.month++;
    }
    this.dayOfWeekFirstOfMonth = new Array(moment(this.getSelectedMonth()).day());
  }

  decreaseMonth() {
    if (this.month == 0) {
      this.month = 11;
      this.year--;
      if (this.appointments[this.year] === undefined) {
        this.appointments[this.year] = JSON.parse(JSON.stringify(months));
      }
    } else {
      this.month--;
    }
    this.dayOfWeekFirstOfMonth = new Array(moment(this.getSelectedMonth()).day());
  }

  getSelectedMonth() {
    return this.year + '-' + (this.month + 1).toString().padStart(2, '0') + '-' + '01';
  }

  selectResult(date) {
    this.month = moment(date).month();
    this.year = moment(date).year();
  }

  // TODO unit test for this stuff
  private findApptInSearchDomain(month, day, appt): number {
    return this.searchDomain.findIndex(searchVal => {
      return (
        searchVal.date.getTime() == new Date(month + 1 + '/' + day + '/' + this.year).getTime() &&
        searchVal.text == JSON.stringify(appt.title + ' ' + appt.description)
      );
    });
  }
}
