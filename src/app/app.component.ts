import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { appointments } from './appointments.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  appointments = appointments;
  monthsTxt = ['January', 'February'];
  Object = Object;
  modalRef: BsModalRef;
  day;
  today: number = Date.now();
  dayOfMonth = moment(this.day).date();
  month = 0;

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>, day: number) {
    this.modalRef = this.modalService.show(template);
    this.day = day;
  }

  saveAppt(input) {
    this.appointments[this.month][this.day].push({ name: input });
    this.modalRef.hide();
  }

  increaseMonth(){
    this.month ++;
  }

  decreaseMonth(){
    this.month --;
  }

}
