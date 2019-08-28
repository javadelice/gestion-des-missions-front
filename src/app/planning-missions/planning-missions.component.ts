import { Component, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { generate } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { MissionsService } from '../missions/missions.service';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlanningService } from './planning.service';

@Component({
  selector: 'app-planning-missions',
  templateUrl: './planning-missions.component.html',
  styleUrls: ['./planning-missions.component.css']
})
export class PlanningMissionsComponent implements OnInit {

  currentDate = moment().locale('fr');
  numberDaysInMonth: number;
  firstDayOfMonth: number;
  datesInMonth = [];
  weeksInMonth: number[][];

  mission: MissionDto;
  missions: MissionDto[];
  missionDates: {
    date: number;
    type: string;
    missionId: number;
  }[];
  dateTemp;
  isError: boolean;

  modalRef: BsModalRef;

  constructor(private planningService: PlanningService, private missionService: MissionsService, private _authService: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authService.collegueConnecteObs.subscribe(collegueConnecte => {
      this.missionService.getMissions(collegueConnecte.id).subscribe((missions: MissionDto[]) => {
        this.missionDates = [];
        this.missions = missions;
        this.generateMissionCalendar();
        this.generateCalendar();
      }, (error: HttpErrorResponse) => {
        this.isError = true;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

  generateCalendar(): void {
    this.numberDaysInMonth = this.currentDate.daysInMonth();
    this.firstDayOfMonth = this.currentDate.startOf('month').isoWeekday();
    this.weeksInMonth = [];
    let counter = 0;
    for (let i = 1; i < this.firstDayOfMonth; i++) {
      this.datesInMonth.push(undefined);
    }
    for (let i = 1; i <= this.numberDaysInMonth; i++) {
      this.datesInMonth.push(moment(this.currentDate).add(counter, 'day').date());
      counter++;
    }
    while (this.datesInMonth.length > 0) {
      this.weeksInMonth.push(this.datesInMonth.splice(0, 7));
    }
  }

  generateMissionCalendar(): void {
    for (const mission of this.missions) {
      if (moment(mission.startDate).month() === this.currentDate.month() && moment(mission.startDate).year() === this.currentDate.year()) {
        this.dateTemp = moment(mission.startDate);
        while (moment(this.dateTemp).isBefore(this.currentDate.endOf('month')) && moment(this.dateTemp).isBefore(moment(mission.endDate).add(1, 'day'))) {
          if (moment(this.dateTemp).isoWeekday() !== 6 && moment(this.dateTemp).isoWeekday() !== 7) {
            this.missionDates.push({date: moment(this.dateTemp).date(), type: mission.nature.code, missionId: mission.id});
          }
          this.dateTemp = this.dateTemp.add(1, 'day');
        }
      }
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

  openModalMission(template: TemplateRef<any>, idMission: number) {
    this.planningService.getMission(idMission).subscribe(mission => {
      this.mission = mission;
      this.modalRef = this.modalService.show(template);
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

}
