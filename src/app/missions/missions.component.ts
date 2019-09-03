import { Component, OnInit, TemplateRef } from '@angular/core';
import { MissionsService } from './missions.service';
import { MissionDto } from '../models/mission-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {

  missions: MissionDto[];
  idMissionASupprimer: number;
  idMissionAModifier: number;
  phaseModifier: boolean;
  isError: boolean;
  erreur: string;
  modalRef: BsModalRef;

  constructor(private missionService: MissionsService, private _authSrv: AuthService, private modalService: BsModalService,
    private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('Gestion des missions');
    this.isError = false;
    this.phaseModifier = false;
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this.missionService.getMissions(collegueConnecte.id).subscribe((missions: MissionDto[]) => {
        this.missions = missions;
      }, (error: HttpErrorResponse) => {
        this.isError = true;
        this.erreur = error.status + ' - ' + error.message;
      });
    }
      , (error: HttpErrorResponse) => {
        this.isError = true;
        this.erreur = error.status + ' - ' + error.message;
      });
  }

  modifierMission(idMission: number) {
    this.idMissionAModifier = idMission;
    this.phaseModifier = true;
  }

  openModal(template: TemplateRef<any>, idMission: number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.idMissionASupprimer = idMission;
  }

  confirm() {
    this.deleteMission();
    this.modalRef.hide();
  }

  decline() {
    this.idMissionASupprimer = undefined;
    this.modalRef.hide();
  }

  deleteMission() {
    this.missionService.deleteMission(this.idMissionASupprimer).subscribe(() => {
      this.ngOnInit();
      this.idMissionASupprimer = undefined;
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.erreur = error.status + ' - ' + error.message;
    });
  }

  finModifier($event) {
    if ($event) {
      this.ngOnInit();
    }
  }

  recommencer() {
    this.ngOnInit();
  }

}
