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
  noteDeFraisTab: NdfEntryDto[];
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
  ndfCumulExists: boolean;
  erreurAjoutLDF: boolean;
  verifDoublonLDF: boolean;
  montantNDF: number;
  depassementAutorise: boolean;
  depassementFrais: boolean;
  depassementValide: boolean;
  errorMessage: string;
  estimationPrime: number;
  dateTemp;
  nbJoursTravailles: number;
  isError: boolean;


  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService, private _router: Router, private modalService: BsModalService) { } //public dialog: MatDialog) { }

  ngOnInit() {
    this.noteDeFraisTab = [];
    this.creerOk = false;
    this.error = false;
    this.creation = false;
    this.modification = false;
    this.erreurAjoutLDF = false;
    this.depassementAutorise = true;
    this.depassementFrais = false;
    this.depassementValide = true;

    this.ndfCumul = new NdfCumul();

    this.estimerPrime();

    this._ndfSrv.getNdfEntriesFromMissionId(this.mission.id).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
      this.noteDeFraisTab = noteDeFraisTab;
      if (this.noteDeFraisTab.length === 0) {
        this.ndfCumulExists = false;
        this.ndfCumul.mission = this.mission;
      }
      else {
        this.ndfCumulExists = true;
        this.ndfCumul = this.noteDeFraisTab[0].ndfCumul;
      }
      this.phaseModifier = false;
    }, (error: HttpErrorResponse) => {
      this.error = true;
    });
  }

  estimerPrime() {
    this.nbJoursTravailles = 0;
    this.estimationPrime = 0;
    this.dateTemp = moment(this.mission.startDate);
    while (moment(this.dateTemp).isBefore(moment(this.mission.endDate))) {
      if (moment(this.dateTemp).isoWeekday() !== 6 && moment(this.dateTemp).isoWeekday() !== 7) {
        this.nbJoursTravailles += 1;
      }
      this.dateTemp = moment(this.dateTemp).add(1, 'day');
    }
    this.estimationPrime = this.nbJoursTravailles * this.mission.nature.tjm * this.mission.nature.pourcentagePrime / 100;
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
        }
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
    this.depassementAutorise = true;
    this.depassementFrais = false;
    this.depassementValide = true;
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
      this.errorMessage = 'Erreur : vous ne pouvez pas créer deux lignes de frais identiques, la date de la ligne de frais doit être comprise dans les dates de la mission et le montant doit être supérieur à 0!';
    }
  }

  creer() {
    this.montantNDF = 0;
    if (!this.mission.nature.hasPrime) {
      for (const ndf of this.noteDeFraisTab) {
        if (ndf.montant > this.mission.nature.plafondFrais) {
          this.depassementAutorise = false;
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
      if (this.depassementFrais &&
        this.estimationPrime - (this.montantNDF - this.mission.nature.plafondFrais * this.nbJoursTravailles) < 0) {
        this.depassementValide = false;
        this.errorMessage = 'Le dépassement des frais est trop important (prime - déduction < 0) !';
      } else {
        if (!this.ndfCumulExists) {
          this._ndfSrv.createNdf(this.ndfCumul).subscribe(ndfCumul => {
            for (const ndf of this.noteDeFraisTab) {
              ndf.ndfCumul = this.ndfCumul;
              this._ndfSrv.createNdfEntry(ndf).subscribe(noteDeFrais => {
              });
            }
          }, (error: HttpErrorResponse) => {
            this.isError = true;
          });
        } else {
          for (const ndf of this.noteDeFraisTab) {
            ndf.ndfCumul = this.ndfCumul;
            this._ndfSrv.createNdfEntry(ndf).subscribe(noteDeFrais => {
            });
          }
        }
      }
    }
  }
}


