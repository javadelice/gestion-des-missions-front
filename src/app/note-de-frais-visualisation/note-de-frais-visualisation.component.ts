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
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { Title } from '@angular/platform-browser';

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
  //currentNdfEntryId: number;
  //ndfEntryToggle: boolean;
  currentNdfEntry: NdfEntryDto = new NdfEntryDto(0, this.currentDate, "", 0, new NdfCumul());
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
  modification: boolean;
  confirmation: boolean;
  doublon: boolean;
  indexMatching: number;
  @Input() isExportPDF: boolean;
  isExportPDFcurr: boolean=false;
  currentNdfCumul: NdfCumul;
  currentMissionId: number;
  currentMission:MissionDto;


  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService,
    private _router: Router, private modalService: BsModalService,
    private _titleSrv: Title) { } //public dialog: MatDialog) { }

  ngOnInit() {
    this.noteDeFraisTab = [];
    this._titleSrv.setTitle('Mission ' + this.mission.id + ' ' + 'Note de frais')
    this.creerOk = false;
    this.error = false;
    this.creation = false;
    this.modification = false;
    this.erreurAjoutLDF = false;
    this.depassementAutorise = true;
    this.depassementFrais = false;
    this.depassementValide = true;

    this.doublon = false;
    this.currentMission = this.mission;
    this.currentMissionId = this.mission.id;

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

    if (!this.isExportPDFcurr) {
      if (this.isExportPDF) {
        this.isExportPDFcurr = true;
        this.generatePDF(this.currentMissionId);
      }
    }
  }
  generatePDF(missionId: number) {
      //let doc = new jsPDF('p', 'mm', 'a4'); //portrait/landscape mmcmin A4 size page of PDF

      var doc = new jsPDF();
      doc.autoTable({ html: '#tableLignesDeFrais' });

      doc.save('mission' + this.currentMissionId + '-' + 'Note-de-frais' + '.pdf');
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

  validerModif(template: TemplateRef<any>) {
    // this.currentNdfEntryId = this.noteDeFraisTab.findIndex((ndfEntry) => {
    //   ndfEntry.id === this.currentNdfEntryId;

    if ((this.noteDeFraisTab[this.indexMatching].date === this.currentNdfEntry.date)
      && (this.noteDeFraisTab[this.indexMatching].nature === this.currentNdfEntry.nature)) {
      this.doublon = true;
    } else {
      this._ndfSrv.modifyNdfEntry(this.currentNdfEntry).subscribe(() => {
        this.openModal(template, this.currentNdfEntry.id);
        this.modification = false;
        this.doublon = false;
        this.recommencer();
      }, (error: HttpErrorResponse) => {
        this.errModif = error.message;
      });
    }
    // });
  }

  cancelModif() {
    this.modification = false;
    this.doublon = false;
  }

  showNdfEntryEditPanel(ndfId: number, indexMatchingTab: number) {
    this.currentNdfEntry.id = this.noteDeFraisTab[indexMatchingTab].id;
    this.currentNdfEntry.date = this.noteDeFraisTab[indexMatchingTab].date;
    this.currentNdfEntry.nature = this.noteDeFraisTab[indexMatchingTab].nature;
    this.currentNdfEntry.montant = this.noteDeFraisTab[indexMatchingTab].montant;
    this.currentNdfEntry.ndfCumul = this.mission.ndfCumul;
    //this.ndfEntryToggle = true;
    this.modification = true;
    this.indexMatching = indexMatchingTab;

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

  creationActivate() {
    this.creation = true;
    this.erreurAjoutLDF = false;
    this.verifDoublonLDF = true;

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


