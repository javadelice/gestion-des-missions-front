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

  isAdmin: boolean;

  error: string;
  isError: boolean;

  naturesMissions: NatureDto[];
  modalRef: BsModalRef;

  natureASupprimer: NatureDto;
  natureAModifier: NatureDto;
  natureACreer: NatureDto;

  constructor(private natureService: NatureMissionService, private _authSrv: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      if (collegueConnecte.roles.includes('ROLE_ADMINISTRATEUR')) {
        this.isAdmin = true;
      }
      this.natureService.recupNature(collegueConnecte.id).subscribe((natureMissions: NatureDto[]) => {
        this.naturesMissions = natureMissions;
      });
    });
  }

  openDeleteModal(template: TemplateRef<any>, nature: NatureDto) {
    this.natureASupprimer = nature;
    this.isError = false;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  openCreateModal(create: TemplateRef<any>) {
    this.natureACreer = new NatureDto(0, '', '', '', 0, 0, 0, '');
    this.modalRef = this.modalService.show(create, {class: 'modal-md'});
  }

  openModifModal(modif: TemplateRef<any>, natureAt: NatureDto) {
    this.natureAModifier = {...natureAt};
    this.modalRef = this.modalService.show(modif, {class: 'modal-sm'});
  }

  confirm() {
    this.deleteNature();
  }

  decline() {
    this.natureASupprimer = undefined;
    this.modalRef.hide();
  }

  creerNature() {
    if (this.natureACreer.isFacturee !== 'OUI') {
      this.natureACreer.tjm = null;
      this.natureACreer.hasPrime = null;
    }
    if (this.natureACreer.hasPrime !== 'OUI') {
      this.natureACreer.pourcentagePrime = null;
    }
    this.natureService.createNature(this.natureACreer).subscribe(nature => {
      this.isError = false;
      this.modalRef.hide();
<<<<<<< HEAD
      this.natureMissions.push(nature);
      this.natMission = new NatureDto(0, '', '', '', 0, "", 0, "",'', 0);
=======
      this.naturesMissions.push(nature);
>>>>>>> master
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.error = error.error;
    });
  }

  annulerCreation() {
    this.modalRef.hide();
<<<<<<< HEAD
    this.natMission = new NatureDto(0, '', '', '', 0, "", 0, "",'', 0);
=======
>>>>>>> master
  }

  deleteNature() {
    this.natureService.deleteNature(this.natureASupprimer.id).subscribe(() => {
      this.modalRef.hide();
      this.naturesMissions.splice(this.naturesMissions.indexOf(this.natureASupprimer));
      this.natureASupprimer = undefined;
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.error = error.error;
    });
  }

  modifierNature() {
    this.natureService.modifyNature(this.natureAModifier).subscribe(natureModif => {
      this.isError = false;
      this.modalRef.hide();
      this.ngOnInit();
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.error = error.error;
    });
  }


  annulerModif() {
    this.modalRef.hide();
}

  recommencer() {
    this.ngOnInit();
  }


}
