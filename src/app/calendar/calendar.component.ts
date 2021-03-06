import { Component, TemplateRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { Appointment } from '../model/appointment.model';
import { months } from '../model/months.model';
import { AppService } from '../service/app.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

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
  year = moment(this.today).year();
  day = 1;

  appointments;
  appointment = <Appointment>{ contacted: false };
  selectedAppt = null;

  searchDomain = [];
  searchResults = [];
  showResults = false;
  searchParam;

  submitted = false;
  dayOfWeekFirstOfMonth = new Array(moment(this.getSelectedMonth()).day());
  daysFromNextMonth = [];

  editFlow = false;
  editFlowIndex = 0;
  slideLeft = false;
  slideRight = false;

  poll = Observable.interval(10000);
  sub;

  constructor(private modalService: BsModalService, private appService: AppService) { }

  ngOnInit() {
    this.appointments = this.appService.getAppts() !== null ? this.appService.getAppts() : this.getEmptyCalendar();
    this.searchDomain = this.appService.getApptsSearchDomain()!== null ? this.appService.getApptsSearchDomain() : [];
    this.findDaysFromNextMonth();
    // polls server to get appts to keep status of appts up to date
    this.sub = this.poll.subscribe((val) => {
      this.appService.retrieveUserApptsFromServer().subscribe(res => {
        if (res != null && res[this.year] != null) {
          this.appService.saveAppts(res);
          this.appointments = res;
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Check only when no input is selected
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft' && event.srcElement.localName == 'body') {
      this.decreaseMonth();
    } else if (event.key == 'ArrowRight' && event.srcElement.localName == 'body') {
      this.increaseMonth();
    } else if ((event.key == 'Delete' || event.key == 'Backspace') && this.selectedAppt && !this.editFlow) {
      this.removeAppt(this.selectedAppt.month, this.selectedAppt.day, this.selectedAppt.index);
    }
  }
  // Clear selected appointment
  @HostListener('click', ['$event'])
  onClick(event) {
    if (!event.srcElement.className.includes('card-link')) {
      this.selectedAppt = null;
      this.editFlow = false;
      this.editFlowIndex = 0;
    }
  }

  openModal(template: TemplateRef<any>, month, day) {
    this.appointment.time = new Date();
    this.modalRef = this.modalService.show(template);
    this.month = month;
    this.day = day;
  }

  editAppt(template: TemplateRef<any>, month, day, i) {
    this.month = month;
    this.day = day;
    this.appointment = this.appointments[this.year][month][day][i];
    this.editFlow = true;
    this.editFlowIndex = i;
  }

  saveAppt() {
    const dateOfAppt = new Date(this.appointment.time);
    dateOfAppt.setDate(this.day);
    dateOfAppt.setMonth(this.month);
    dateOfAppt.setFullYear(this.year);
    this.appointment.time = dateOfAppt;
    // TODO this is needed in order to keep track of user timezone so it displays correctly on text message
    this.appointment.timezoneOffset = dateOfAppt.getTimezoneOffset();
    if (this.editFlow) {
      this.appointment.contacted = false;
      this.appointments[this.year][this.month][this.day][this.editFlowIndex] = this.appointment;
      this.updateSearchDomain();
    } else {
      this.appointment.id = this.generateId();
      this.appointments[this.year][this.month][this.day].push(this.appointment);
      this.appointments[this.year][this.month][this.day].sort((v1, v2) => v1.time - v2.time);

      this.addToSearchDomain();
    }

    this.modalRef.hide();
    this.persistState();
  }

  cancelAppt() {
    this.appointment = <Appointment>{};
    this.modalRef.hide();
  }

  removeAppt(month, day, index) {
    this.appointments[this.year][month][day].splice(index, 1);
    let indexOfSearch = this.findApptInSearchDomain();
    if (indexOfSearch !== -1) {
      this.searchDomain.splice(indexOfSearch, 1);
    }

    this.persistState();
  }

  selectAppt(month, day, index, id) {
    this.selectedAppt = { "month": month, "day": day, "index": index, "id": id };
  }

  isSelected(id) {
    return this.selectedAppt != undefined && this.selectedAppt.id == id;
  }

  searchAppts(input) {
    this.searchResults = this.searchDomain.filter(appt => appt.text.toLowerCase().includes(input.toLowerCase()));
    this.showResults = true;
    this.slideLeft = true;
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
    this.findDaysFromNextMonth();
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
    this.findDaysFromNextMonth();
  }

  getSelectedMonth() {
    return this.year + '-' + (this.month + 1).toString().padStart(2, '0') + '-' + '01';
  }

  selectResult(date) {
    this.year = moment(date).year();
    this.month = moment(date).month();
    this.dayOfWeekFirstOfMonth = new Array(moment(this.getSelectedMonth()).day());
    this.findDaysFromNextMonth();
  }

  // TODO look into this contacted false
  persistState() {
    this.appService.saveAppts(this.appointments);
    this.appService.saveApptsSearchDomain(this.searchDomain);
    this.appService.updateAppointments(this.appointments).subscribe();
    this.appointment = <Appointment>{ contacted: false };
    this.editFlow = false;
    this.editFlowIndex = 0;
    this.selectedAppt = null;
  }

  hideResults() {
    this.slideLeft = false;
    this.slideRight = true;
    setTimeout(() => {
      this.showResults = false;
      this.slideRight = false;
    }, 300);
  }

  findDaysFromNextMonth() {
    let numOfDaysInMonth: number = Object.keys(this.appointments[this.year][this.month]).length;
    let prevMonthDays: number = this.dayOfWeekFirstOfMonth.length;
    let num = (numOfDaysInMonth + prevMonthDays) % 7;
    let response = (num === 0) ? 0 : 7 - num;
    this.daysFromNextMonth = Array(response);
  }

  deleteSelected() {
    if (this.selectedAppt && !this.editFlow) {
      this.removeAppt(this.selectedAppt.month, this.selectedAppt.day, this.selectedAppt.index);
    }
  }

  // TODO unit test for this stuff
  private findApptInSearchDomain(): number {
    return this.searchDomain.findIndex(searchVal => {
      return this.selectedAppt.id == searchVal.id;
    });
  }

  private generateId(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36)
    );
  }

  private addToSearchDomain() {
    this.searchDomain.push({
      id: this.appointment.id,
      date: new Date(this.month + 1 + '/' + this.day + '/' + this.year),
      text: JSON.stringify(this.appointment.title + ' ' + this.appointment.description + ' ' + this.appointment.phoneNumber),
      title: this.appointment.title,
      phoneNumber: this.appointment.phoneNumber
    });
  }

  private updateSearchDomain() {
    const index = this.searchDomain.findIndex(element => {
      return (this.appointment.id === element.id);
    });

    // TODO fix case where appointments exist but there is no search domain locally
    if(index !== -1) {
    let modifiedAppt = this.searchDomain[index];
    modifiedAppt.text = this.appointment.title + ' ' + this.appointment.description + ' ' + this.appointment.phoneNumber;
    modifiedAppt.title = this.appointment.title;
    modifiedAppt.phoneNumber = this.appointment.phoneNumber;

    this.searchDomain[index] = modifiedAppt;
    }
  }

  private getEmptyCalendar() {
    let year = this.year;
    let emptyCalendar = {};
    emptyCalendar[year] = JSON.parse(JSON.stringify(months));
    return emptyCalendar;
  }

}
