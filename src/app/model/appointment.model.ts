export class Appointment {
  constructor(
    public title: string,
    public description: string,
    public time: Date,
    public phoneNumber: string,
    public textNotification: boolean
  ) {}
}
