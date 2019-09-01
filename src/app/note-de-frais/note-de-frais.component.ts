import { Component, OnInit } from '@angular/core';
//import {MatDialog} from '@angular/material/dialog';
import { MissionDto } from '../models/mission-dto';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MissionsService } from '../missions/missions.service';
import { NdfService } from './note-de-frais.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-note-de-frais',
  templateUrl: './note-de-frais.component.html',
  styleUrls: ['./note-de-frais.component.css']
})
export class NoteDeFraisComponent implements OnInit {
  missions: MissionDto[];
  frais: number[];
  currentDate = new Date();
  phaseModifier: Boolean;
  error: boolean;
  modalRef: BsModalRef;
  ndfvisu: boolean;
  missionChosen: MissionDto;

 constructor(private _authSrv: AuthService, 
    private missionService: MissionsService, 
    private _ndfService: NdfService, 
    private _router: Router) { }
  
ngOnInit() {


    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this.missionService.getMissions(collegueConnecte.id).subscribe((missions: MissionDto[]) => {
        this.missions = missions;
        this.phaseModifier = false;
      }, (error: HttpErrorResponse) => {
        this.error = true;
      });
    });


  }

  missionIsEchue(mission: MissionDto) {
    return new Date(mission.endDate) < this.currentDate;
  }

  ajoutNdf(mission) {
    this.ndfvisu = true;
    this.missionChosen = mission;
  }


  exportToPDF(): void {
    //TODO
  }

}
