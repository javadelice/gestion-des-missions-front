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
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import {Title }  from '@angular/platform-browser';

@Component({
  selector: 'app-note-de-frais-visualisation',
  templateUrl: './note-de-frais-visualisation.component.html',
  styleUrls: ['./note-de-frais-visualisation.component.css']
})
export class NoteDeFraisVisualisationComponent implements OnInit {
  noteDeFraisTab: NdfEntryDto[] = [];
  currentMission: MissionDto = new MissionDto(3, "", "", null, "", "", "", "", null, new NdfCumul());
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
  modification: boolean;
  confirmation: boolean;
  creerOk: boolean;
  err: string;
  doublon: boolean;
  indexMatching: number;
  @Input() isExportPDF: boolean;
  isExportPDFcurr:boolean;
  

  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService, 
    private _router: Router, private modalService: BsModalService,
    private _titleSrv:Title) { } //public dialog: MatDialog) { }

  ngOnInit() {
    this._titleSrv.setTitle('Mission '+this.mission.id+' '+'Note de frais')
    this.creerOk = false;
    this.error = false;
    this.creation = false;
    this.modification = false;
    this.doublon = false;

    this.currentMission = this.mission;
    if (true) {
      //if (this.mission) {
      //this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this._ndfSrv.getNdfEntriesFromMissionId(this.mission.id).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
        this.noteDeFraisTab = noteDeFraisTab;
        this.phaseModifier = false;
      }, (error: HttpErrorResponse) => {
        this.error = true;
      })

    }

    if (this.isExportPDF) {
      if(!this.isExportPDFcurr){
        
        this.isExportPDFcurr=true;
        this.generatePDF(this.mission.id);
      }
    }
  }

  generatePDF(missionId:number) {
    
    if (this.mission.id) {
      html2canvas(document.getElementById('contentToConvert')).then(function (canvas) {

/*
        var doc = new jsPDF();
        doc.text(50, 100, 'page 1');
        var img = canvas.toDataURL("image/png");
        doc.addImage(img, 'JPEG', 100, 100);
        doc.addPage();
        doc.text(50, 100, 'page 2')
*/
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      //const contentDataURL = canvas.toDataURL('image/png')
      //const contentDataURL = canvas.toDataURL();
      let doc = new jsPDF('p', 'mm', 'a4'); //portrait/landscape mmcmin A4 size page of PDF
      var position = 0;
      //doc.text(190,7,'page 1');
      //doc.addPage(canvas);
      //var img = canvas.toDataURL("image/octet-stream");
      //doc.addImage(img, 'JPEG', 3, 190);
      //doc.addImage(contentDataURL, 'JPG', 0, position, canvas.width, canvas.height)
      //doc.autoTable({html: '#tableMissionCourante'});
      doc.autoTable({html: '#tableLignesDeFrais'});

      doc.save('mission'+missionId + '-' + 'Note-de-frais' + '.pdf');
      });
    } else {

    }
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
    this.currentNdfEntry.ndfCumul = this.currentMission.ndfCumul;
    //this.ndfEntryToggle = true;
    this.modification = true;
    this.indexMatching = indexMatchingTab;

  }

  openModalDelete(template: TemplateRef<any>, ndfEntryId: number) {

    if (true) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if (ndfEntry.id == ndfEntryId) {
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
    this.newNdfEntry.ndfCumul = this.mission.ndfCumul;
  }
  recommencer() {
    this.ngOnInit();
  }

  creer() {

    if ((this.noteDeFraisTab[this.currentNdfEntry.id].date === this.currentNdfEntry.date)
      && (this.noteDeFraisTab[this.currentNdfEntry.id].nature === this.currentNdfEntry.nature)) {
      this.doublon = true;
    } else {
      this._ndfSrv.createNdfEntry(this.newNdfEntry).subscribe(() => {
        this.creerOk = true;
        this.error = false;
      }, (error: HttpErrorResponse) => {
        this.creerOk = false;
        this.error = true;
        this.err = error.error;
        this.doublon = false;
      });
    }
  }
}


