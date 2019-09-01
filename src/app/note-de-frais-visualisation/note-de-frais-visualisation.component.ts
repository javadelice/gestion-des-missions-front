import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NdfEntryDto, NdfNature } from './note-de-frais-visualisation.domains';
import { HttpErrorResponse } from '@angular/common/http';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MissionDto } from '../models/mission-dto';
import { NatureDto } from '../models/nature-dto';
import { NdfCumul } from '../note-de-frais/note-de-frais.domains';
import * as moment from 'moment';

@Component({
  selector: 'app-note-de-frais-visualisation',
  templateUrl: './note-de-frais-visualisation.component.html',
  styleUrls: ['./note-de-frais-visualisation.component.css']
})
export class NoteDeFraisVisualisationComponent implements OnInit {
  noteDeFraisTab: NdfEntryDto[] = [];
  @Input() mission: MissionDto;
  currentDate = new Date();
  phaseModifier: Boolean;
  error: boolean;
  currentNdfEntryId: number;
  ndfEntryToggle: boolean;
  modification: boolean;
  confirmation: boolean;
  currentNdfEntry: NdfEntryDto;
  ndfEntryIdToDelete: number;
  modalRef: BsModalRef;
  keys = Object.keys;
  //ndfNature: NdfNature;
  ndfNature: string[] = ["ACTIVITE", "HOTEL", "PETIT_DEJEUNER", "DEJEUNER", "DINER", "CARBURANT", "TAXI", "TRAIN", "AVION"];
  errModif: string;
  newNdfEntry: NdfEntryDto = new NdfEntryDto(0, this.currentDate, "", 0, new NdfCumul());
  //validerButton:BsButton;
  creation: boolean;
  creerOk: boolean;
  err: string;

  ndfCumul: NdfCumul;
  erreurAjoutLDF: boolean;
  verifDoublonLDF: boolean;
  montantNDF: number;
  depassementValide: boolean;
  depassementFrais: boolean;
  errorMessage: string;
  estimationPrime: number;
  dateTemp;
  nbJoursTravailles: number;


  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService, private _router: Router, private modalService: BsModalService) { } //public dialog: MatDialog) { }

  ngOnInit() {
    this.creerOk = false;
    this.error = false;
    this.creation = false;
    this.modification = false;
    this.erreurAjoutLDF = false;
    this.depassementValide = true;
    this.depassementFrais = false;

    this.ndfCumul = new NdfCumul();

    this._ndfSrv.getNdfEntriesFromMissionId(this.mission.id).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
      this.noteDeFraisTab = noteDeFraisTab;
      this.phaseModifier = false;
    }, (error: HttpErrorResponse) => {
      this.error = true;
    });
  }

  estimerPrime() {
    this.dateTemp = moment(this.mission.startDate);
  }

  validerModif(template: TemplateRef<any>, currentNdfId: number) {
    // this.currentNdfEntryId = this.noteDeFraisTab.findIndex((ndfEntry) => {
    //   ndfEntry.id === this.currentNdfEntryId;
    this._ndfSrv.modifyNdfEntry(this.currentNdfEntry).subscribe(() => {
      this.openModal(template, currentNdfId);
      this.modification = false;
    }, (error: HttpErrorResponse) => {
      this.errModif = error.message;
    });
    // });
  }

  cancelModif() {
    this.modification = false;
  }

  modifierNdfEntry(ndfId: number) {
    this.phaseModifier = true;
    if (ndfId) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if (ndfEntry.id === ndfId) {
          this.currentNdfEntry = ndfEntry;
        };
      })
      //this.currentNdfEntryId=ndfId;
    }
    this.ndfEntryToggle = true;
    this.modification = true;
  }

  openModalDelete(template: TemplateRef<any>, ndfEntryId: number) {

    if (true) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if (ndfEntry.id === ndfEntryId) {
          this.currentNdfEntry = ndfEntry;
          this.ndfEntryIdToDelete = ndfEntryId;

          this.modalRef = this.modalService.show(template, {
            backdrop: true,
            ignoreBackdropClick: true,
            class: 'modal-sm'
          });
        };
      });

    }
  }

  confirmDelete() {
    this._ndfSrv.deleteNdfEntry(this.ndfEntryIdToDelete).subscribe(() => {
      this.modalRef.hide();
      this.ngOnInit();
    });

  }

  openModal(template: TemplateRef<any>, ndfId: number) {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    });
  }


  confirmModif() {
    this.modalRef.hide();
  }

  decline() {
    this.ndfEntryIdToDelete = undefined;
    this.modalRef.hide();
  }
  deleteNdf() {
    this._ndfSrv.deleteNdfEntry(this.ndfEntryIdToDelete).subscribe(() => {
      this.ngOnInit();
      this.ndfEntryIdToDelete = undefined;
    }, (error: HttpErrorResponse) => {
      this.error = true;
    });
  }

  finModifier($event) {
    if ($event) {
      this.ngOnInit();
    }
  }

  creationActivate() {
    this.creation = true;
    this.erreurAjoutLDF = false;
    this.verifDoublonLDF = true;
    this.newNdfEntry = new NdfEntryDto(0, this.currentDate, '', 0, new NdfCumul());
  }

  recommencer() {
    this.creerOk = false;
    this.error = false;
    this.creation = false;
    this.modification = false;
    this.erreurAjoutLDF = false;
    this.verifDoublonLDF = true;
    this.depassementValide = true;
    this.depassementFrais = false;
  }

  creerLigneDeFrais() {
    for (const ldf of this.noteDeFraisTab) {
      if (ldf.date === this.newNdfEntry.date && ldf.nature === this.newNdfEntry.nature && ldf.montant === this.newNdfEntry.montant) {
        this.verifDoublonLDF = false;
      }
    }
    if (new Date(this.newNdfEntry.date) > new Date(this.mission.endDate) || new Date(this.newNdfEntry.date) < new Date(this.mission.startDate)) {
      this.verifDoublonLDF = false;
    }
    if (this.newNdfEntry.montant <= 0) {
      this.verifDoublonLDF = false;
    }
    if (this.verifDoublonLDF) {
      this.noteDeFraisTab.push(this.newNdfEntry);
      this.creerOk = true;
    } else {
      this.erreurAjoutLDF = true;
    }
  }

  creer() {
    this.montantNDF = 0;
    if (!this.mission.nature.hasPrime) {
      for (const ndf of this.noteDeFraisTab) {
        if (ndf.montant > this.mission.nature.plafondFrais) {
          this.depassementValide = false;
          this.errorMessage = 'Vous n\'avez pas droit au dépassement de frais sur cette mission !';
          break;
        }
      }
    } else {
      for (const ndf of this.noteDeFraisTab) {
        this.montantNDF += ndf.montant;
        if (ndf.montant > this.mission.nature.plafondFrais) {
          this.depassementFrais = true;
        }
      }
      if (this.depassementFrais) {

      }
    }


    if (this.depassementValide === true) {

    }


    // this._ndfSrv.createNdfEntry(this.newNdfEntry).subscribe(() => {
    //   this.creerOk = true;
    //   this.error = false;
    // }, (error: HttpErrorResponse) => {
    //   this.creerOk = false;
    //   this.error = true;
    //   this.err = error.error;
    // });
  }
}


