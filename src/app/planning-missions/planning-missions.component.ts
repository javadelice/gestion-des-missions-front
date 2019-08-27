import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-planning-missions',
  templateUrl: './planning-missions.component.html',
  styleUrls: ['./planning-missions.component.css']
})
export class PlanningMissionsComponent implements OnInit {

  currentDate = moment();
  numberDaysInMonth: number;
  firstDayOfMonth: number;
  datesInMonth = [];
  weeksInMonth: number[][];

  constructor() { }

  ngOnInit() {
    this.numberDaysInMonth = this.currentDate.daysInMonth();
    this.firstDayOfMonth = this.currentDate.startOf('month').isoWeekday();
    this.weeksInMonth = [];
    for (let i = 1; i < this.firstDayOfMonth; i++) {
      this.datesInMonth.push(undefined);
    }
    for (let i = 1; i <= this.numberDaysInMonth; i++) {
      this.datesInMonth.push(i);
    }
    while (this.datesInMonth.length > 0) {
      this.weeksInMonth.push(this.datesInMonth.splice(0, 7));
    }
  }

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.ngOnInit();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.ngOnInit();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.ngOnInit();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.ngOnInit();
  }

}
