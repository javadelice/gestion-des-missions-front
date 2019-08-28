import { Component, OnInit} from '@angular/core';
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
export class CreerMissionComponent implements OnInit {

  listeNatures: NatureDto[];
  isError: boolean;
  creerOk: boolean;
  erreur: string;
  currentDate = new Date();

  mission = new MissionDto(0, '', '', null, '', '', '', 'INITIALE', null);

  // estimationPrime = 0;
  // difference = (this.mission.endDate.valueOf() - this.mission.startDate.valueOf())/86400000;
  // startD = 10;
  // endD = 0;

  constructor(private creerMissionService: CreerMissionService, private _authSrv: AuthService) {
  }

  ngOnInit() {
    this.creerMissionService.getNatures().subscribe(natures => {
      this.creerOk = false;
      this.isError = false;
      this.listeNatures = natures;
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this.mission.collegue = collegueConnecte;
      }, (error: HttpErrorResponse) => {
        this.isError = true;
        this.erreur = error.status + ' - ' + error.error;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.erreur = error.status + ' - ' + error.error;
    });
  }

  creer() {
    this.creerMissionService.createMission(this.mission).subscribe(mission => {
      this.creerOk = true;
      this.isError = false;
    }, (error: HttpErrorResponse) => {
      this.creerOk = false;
      this.isError = true;
      this.erreur = error.error;
    });
  }

  recommencer() {
    this.ngOnInit();
  }

}
