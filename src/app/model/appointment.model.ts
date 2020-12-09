export class Appointment {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public time: Date,
    public phoneNumber: string,
    public contacted:boolean,
    public timezoneOffset: number
  ) {}
}
