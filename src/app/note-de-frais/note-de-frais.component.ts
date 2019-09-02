import { Component, OnInit } from '@angular/core';
//import {MatDialog} from '@angular/material/dialog';
import { MissionDto } from '../models/mission-dto';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MissionsService } from '../missions/missions.service';
import { NdfService } from './note-de-frais.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {Title }  from '@angular/platform-browser';

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
  ndfVisu: boolean;
  missionChosen: MissionDto;
  exportPdf: boolean;

 constructor(private _authSrv: AuthService,
    private missionService: MissionsService,
    private _ndfService: NdfService,
    private _router: Router,
    private _titleService: Title) { }

ngOnInit() {
  this._titleService.setTitle("Notes de frais")
  this.exportPdf = false;

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
    this.ndfVisu = true;
    this.missionChosen = mission;
  }


  exportToPDF(mission:MissionDto): void {
   this.missionChosen = mission;
   this.ndfVisu = true;
   this.exportPdf = true;
  }

}
