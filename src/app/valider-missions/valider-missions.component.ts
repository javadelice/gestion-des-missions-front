import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MissionDto } from '../models/mission-dto';
import { ValiderMissionsService } from './valider-missions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-valider-missions',
  templateUrl: './valider-missions.component.html',
  styleUrls: ['./valider-missions.component.css']
})
export class ValiderMissionsComponent implements OnInit {

  listeMissions: MissionDto[];
  isManager: boolean;
  missionAValider: MissionDto;
  isValidated: boolean;
  isError: boolean;
  erreur: string;
  modalRef: BsModalRef;

  constructor(private validerMissionsService: ValiderMissionsService, private _authSrv: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      if (collegueConnecte.roles.includes('ROLE_MANAGER')) {
        this.isManager = true;
        this.validerMissionsService.getMissionsAValider(collegueConnecte.id).subscribe(missions => {
          this.listeMissions = missions;
        }, (error: HttpErrorResponse) => {
          this.isError = true;
        });
      }
    }, (error: HttpErrorResponse) => {
      this.isManager = false;
      this.isError = true;
    });
  }

  openModalValider(template: TemplateRef<any>, mission: MissionDto) {
    this.missionAValider = mission;
    this.isValidated = true;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  openModalRejeter(template: TemplateRef<any>, mission: MissionDto) {
    this.missionAValider = mission;
    this.isValidated = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  validerMission() {
    this.validerMissionsService.validerMission(this.isValidated, this.missionAValider).subscribe(() => {
      this.ngOnInit();
      this.missionAValider = undefined;
      this.isValidated = undefined;
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
    this.modalRef.hide();
  }

  decline() {
    this.missionAValider = undefined;
    this.modalRef.hide();
  }

}
