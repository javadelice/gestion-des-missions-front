import { Component, OnInit, TemplateRef } from '@angular/core';
import { MissionsService } from './missions.service';
import { MissionDto } from '../models/mission-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {

  missions: MissionDto[];
  idMissionASupprimer:number;
  phaseModifier: boolean;
  isError: boolean;
  modalRef: BsModalRef;

  constructor(private missionService: MissionsService, private _authSrv: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this.missionService.getMissions(collegueConnecte.id).subscribe((missions: MissionDto[]) => {
        this.missions = missions;
        this.phaseModifier = false;
      }, (error: HttpErrorResponse) => {
        this.isError = true;
      })
    }
      , (error: HttpErrorResponse) => {
        this.isError = true;
      })
  }

  modifierMission() {
    this.phaseModifier = true;
  }

  openModal(template: TemplateRef<any>, idMission:number) {
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
    })
  }

}
