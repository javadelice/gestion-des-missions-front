import { Component, OnInit, TemplateRef } from '@angular/core';
import { NatureDto } from '../models/nature-dto';
import { NatureMissionService } from './nature-mission.service';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nature-mission',
  templateUrl: './nature-mission.component.html',
  styleUrls: ['./nature-mission.component.css']
})
export class NatureMissionComponent implements OnInit {

  natureMissions: NatureDto[];
  error: boolean;
  modalRef: BsModalRef;
  idNatureASupprimer:number;
  isAdmin: boolean;
  natMission = new NatureDto(0, '', '', '', 0, 0, 0, '', '', '');

  constructor(private natureService: NatureMissionService, private _authSrv: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      if (collegueConnecte.roles.includes('ROLE_ADMINISTRATEUR')) {
        this.isAdmin = true;
      }
      this.natureService.recupNature(collegueConnecte.id).subscribe((natureMissions: NatureDto[]) => {
        this.natureMissions = natureMissions;
      }, (error: HttpErrorResponse) => {
        this.error = true;
      });
    }
      , (error: HttpErrorResponse) => {
        this.error = true;
      });
  }

  openModal(template: TemplateRef<any>, idNature:number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  openCreateModal(create: TemplateRef<any>) {
    this.modalRef = this.modalService.show(create, {class: 'modal-md'});
  }

  confirm() {
    this.deleteNature();
    this.modalRef.hide();
  }

  decline() {
    this.idNatureASupprimer = undefined;
    this.modalRef.hide();
  }

  deleteNature() {
    this.natureService.deleteNature(this.idNatureASupprimer).subscribe(() => {
      this.ngOnInit();
      this.idNatureASupprimer = undefined;
    }, (error: HttpErrorResponse) => {
      this.error = true;
    })
  }

}
