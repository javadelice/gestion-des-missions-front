import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
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

  erreur: string;
  isError: boolean;
  creerNatOk: boolean;
  natureMissions: NatureDto[];
  natModifOK: boolean;
  error: boolean;
  modalRef: BsModalRef;
  idNatureASupprimer:number;
  idNatureACreer:number;
  isAdmin: boolean;
  natMission = new NatureDto(0, '', '', '', 0, 0, 0, '');
  idNature: number;

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
      })
      ;
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

  openModifModal(modif: TemplateRef<any>, natureAt:NatureDto) {
    this.natMission = {...natureAt};
    this.modalRef = this.modalService.show(modif, {class: 'modal-sm'});
  }

  confirm() {
    this.deleteNature();
    this.modalRef.hide();
  }

  decline() {
    this.idNatureASupprimer = undefined;
    this.modalRef.hide();
  }

  creerNature() {
    if (this.natMission.isFacturee !== 'OUI') {
      this.natMission.tjm = null;
      this.natMission.hasPrime = null;
    }
    if (this.natMission.hasPrime !== 'OUI') {
      this.natMission.pourcentagePrime = null;
    }
    this.natureService.createNature(this.natMission).subscribe(nature => {
      this.creerNatOk = true;
      this.isError = false;
      this.modalRef.hide();
      this.natureMissions.push(nature);
      this.natMission = new NatureDto(0, '', '', '', 0, 0, 0, '');
    }, (error: HttpErrorResponse) => {
      this.creerNatOk = false;
      this.isError = true;
      this.erreur = error.error;
    });
  }

  annulerCreation() {
    this.modalRef.hide();
    this.natMission = new NatureDto(0, '', '', '', 0, 0, 0, '');
  }

  deleteNature() {
    this.natureService.deleteNature(this.idNatureASupprimer).subscribe(() => {
      this.ngOnInit();
      this.idNatureASupprimer = undefined;
    }, (error: HttpErrorResponse) => {
      this.error = true;
    });
  }

  modifierNature() {
    this.natureService.modifyNature(this.natMission).subscribe(natureModif => {
      this.natModifOK = true;
      this.isError = false;
      this.modalRef.hide();
      this.ngOnInit();
    }, (error: HttpErrorResponse) => {
      this.natModifOK = false;
      this.isError = true;
      this.erreur = error.error;
    });
  }


  annulerModif() {
    this.modalRef.hide();
}

  recommencer() {
    this.ngOnInit();
  }


}
