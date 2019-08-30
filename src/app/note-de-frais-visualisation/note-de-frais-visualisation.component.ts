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

@Component({
  selector: 'app-note-de-frais-visualisation',
  templateUrl: './note-de-frais-visualisation.component.html',
  styleUrls: ['./note-de-frais-visualisation.component.css']
})
export class NoteDeFraisVisualisationComponent implements OnInit {
  noteDeFraisTab: NdfEntryDto[]=[];
  currentMission: MissionDto = new MissionDto(3, "", "", null, "", "", "", "", null, new NdfCumul());
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
  ndfNature:string[]= [ "ACTIVITE",  "HOTEL",  "PETIT_DEJEUNER",  "DEJEUNER",  "DINER",  "CARBURANT",  "TAXI",  "TRAIN",  "AVION"];
  errModif: string;
  newNdfEntry: NdfEntryDto =new NdfEntryDto(0, this.currentDate, "", 0, new NdfCumul());
  //validerButton:BsButton;
  creation:boolean;
  creerOk:boolean;
  err:string;
  doublon:boolean;
  indexMatching:number;


  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService, private _router: Router, private modalService: BsModalService) { } //public dialog: MatDialog) { }

  ngOnInit() {
    this.creerOk = false;
    this.error = false;
    this.creation=false;
    this.modification = false;
    this.doublon=false;

    if(true){
    //if (this.mission) {
      //this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this._ndfSrv.getNdfEntriesFromMissionId(this.mission.id).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
          this.noteDeFraisTab = noteDeFraisTab;
          this.phaseModifier = false;
        }, (error: HttpErrorResponse) => {
          this.error = true;
        })

    }

  }

  validerModif(template: TemplateRef<any>, index: number) {
    // this.currentNdfEntryId = this.noteDeFraisTab.findIndex((ndfEntry) => {
    //   ndfEntry.id === this.currentNdfEntryId;

    if((this.noteDeFraisTab[index].date === this.currentNdfEntry.date)
        && (this.noteDeFraisTab[index].nature === this.currentNdfEntry.nature)){
          this.doublon=true;
        }else{
      this._ndfSrv.modifyNdfEntry(this.currentNdfEntry).subscribe(() => {
        this.openModal(template, this.currentNdfEntry.id);
        this.modification = false;
      }, (error: HttpErrorResponse) => {
        this.errModif = error.message;
      });
    }
    // });
  }

  cancelModif() {
    this.modification = false
  }

  modifierNdfEntry(ndfId: number,i) {
    this.phaseModifier = true;
    if (ndfId) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if (ndfEntry.id == ndfId) {
          this.currentNdfEntry = ndfEntry;
          this.indexMatching= i;
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
    this._ndfSrv.deleteNdfEntry(this.ndfEntryIdToDelete).subscribe(()=>{
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


  creationActivate(){
    this.creation=true;
    this.newNdfEntry.ndfCumul=this.mission.ndfCumul;
  }
  recommencer() {
    this.ngOnInit();
  }

      creer() {

      if((this.noteDeFraisTab[this.currentNdfEntry.id].date === this.currentNdfEntry.date)
        && (this.noteDeFraisTab[this.currentNdfEntry.id].nature === this.currentNdfEntry.nature)){
          this.doublon=true;
        }else{
        this._ndfSrv.createNdfEntry(this.newNdfEntry).subscribe(() => {
          this.creerOk = true;
          this.error = false;
        }, (error: HttpErrorResponse) => {
          this.creerOk = false;
          this.error = true;
          this.err = error.error;
          this.doublon=false;
        });
      }
    }
}

