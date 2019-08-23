import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MissionDto } from '../models/mission-dto';
import { NatureDto } from '../models/nature-dto';
import { CreerMissionService } from './creer-mission.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-creer-mission',
  templateUrl: './creer-mission.component.html',
  styleUrls: ['./creer-mission.component.css'],
  providers: [DatePipe]
})
export class CreerMissionComponent implements OnInit, OnChanges {

  listeNatures: NatureDto[];
  isError: boolean;

  mission = new MissionDto(0, "", "", new NatureDto(0, '', '', '', 0, '', '', '', 0), '', '', '', '', null);
  // estimationPrime = 0;
  // difference = (this.mission.endDate.valueOf() - this.mission.startDate.valueOf())/86400000;
  // startD = 10;
  // endD = 0;

  constructor(private creerMissionService: CreerMissionService, private _authSrv: AuthService) {
  }

  ngOnInit() {
    this.creerMissionService.getNatures().subscribe(natures => {
      this.listeNatures = natures;
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this.mission.collegue = collegueConnecte;
      }, (error: HttpErrorResponse) => {});
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  test() {
    console.log(this.mission.endDate);
  }

}
