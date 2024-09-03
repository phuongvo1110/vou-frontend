import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
  ];
  DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  showDatepicker = false;
  datepickerValue!: string;
  @Input() set initialDate(dateStr: string) {
    if (dateStr) {
      const date = new Date(dateStr);
      this.year = date.getFullYear();
      this.month = date.getMonth();
      this.datepickerValue = date.toDateString();
      this.getNoOfDays();
    }
  }
  @Output() date = new EventEmitter<string>();
  month!: number;
  year!: number;
  no_of_days: number[] = [];
  blankdays: number[] = [];

  ngOnInit(): void {
    this.initDate();
    this.getNoOfDays();
  }

  initDate() {
    let today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
  }

  isToday(date: any): boolean {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getDateValue(date: number) {
    const selectedDate = new Date(this.year, this.month, date);
    this.datepickerValue = selectedDate.toDateString();
    this.showDatepicker = false;
    this.date.emit(selectedDate.toISOString().split('T')[0]); // Emit date as "YYYY-MM-DD"
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const dayOfWeek = new Date(this.year, this.month).getDay();
    this.blankdays = Array(dayOfWeek).fill(null);
    this.no_of_days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  trackByIdentity = (index: number, item: any) => item;
}
