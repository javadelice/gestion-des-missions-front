import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MissionDto } from '../models/mission-dto';
import { NatureDto } from '../models/nature-dto';
import { CreerMissionService } from './creer-mission.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NdfCumul } from '../note-de-frais/note-de-frais.domains';
import { Collegue } from '../auth/auth.domains';

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
  col:Collegue;


  //mission = new MissionDto(0, '', '', null, '', '', '', 'INITIALE', null,0);

  mission = new MissionDto(0, '', '', new NatureDto(0, '', '', '', 1, "", 0, '', '', 0), '', '', '', 'INITIALE', 0, null, new NdfCumul());

  constructor(private creerMissionService: CreerMissionService, private _authSrv: AuthService) {
  }

  ngOnInit() {
    this.creerOk = false;
    this.isError = false;
    this.creerMissionService.getNatures().subscribe(natures => {
      this.listeNatures = natures;
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this.mission.collegue = collegueConnecte;
      }, (error: HttpErrorResponse) => {
        this.isError = true;
        this.erreur = error.status + ' - ' + error.message;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.erreur = error.status + ' - ' + error.message;
    });
  }

  creer() {
    this.creerMissionService.createMission(this.mission).subscribe(mission => {
      this.creerOk = true;
      this.isError = false;
    }, (error: HttpErrorResponse) => {
      this.creerOk = false;
      this.isError = true;
      this.erreur = error.status + ' - ' + error.message;
    });
  }

  recommencer() {
    this.ngOnInit();
  }

}
