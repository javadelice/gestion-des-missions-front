import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NdfEntryDto, NdfNatureDto } from './note-de-frais-visualisation.domains';
import { HttpErrorResponse } from '@angular/common/http';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MissionDto } from '../models/mission-dto';
import { NatureDto } from '../models/nature-dto';

@Component({
  selector: 'app-note-de-frais-visualisation',
  templateUrl: './note-de-frais-visualisation.component.html',
  styleUrls: ['./note-de-frais-visualisation.component.css']
})
export class NoteDeFraisVisualisationComponent implements OnInit {
  noteDeFraisTab: NdfEntryDto[] = [];
  currentMission: MissionDto = new MissionDto(3, "", "", null, "", "", "", "", null);
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
  listeNatures: string[] = ["Conseil", "Expertise Technique", "Formation"];
  errModif: string;
  //validerButton:BsButton;


  constructor(private _authSrv: AuthService, private _ndfSrv: NdfService, private _router: Router, private modalService: BsModalService) { } //public dialog: MatDialog) { }

  ngOnInit() {

    this.modification = false;

    if (this.mission.id) {
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this._ndfSrv.getNdfEntriesFromMissionId(this.mission.id).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
          this.noteDeFraisTab = noteDeFraisTab;
          this.phaseModifier = false;
        }, (error: HttpErrorResponse) => {
          this.error = true;
        })
      })
    }

  }

  validerButtonAction(template: TemplateRef<any>, currentNdfId: number) {
    this.currentNdfEntryId = this.noteDeFraisTab.findIndex((ndfEntry) => {
      ndfEntry.id === this.currentNdfEntryId;
    });


    this._ndfSrv.modifyNdfEntry(this.currentNdfEntry).subscribe(() => {

      this.openModal(template, currentNdfId);

    }, (error: HttpErrorResponse) => {
      this.errModif = error.message;
    }

    );




    this.modification = false;
  }

  cancelButtonAction() {
    this.modification = false
  }

  modifierNdfEntry(ndfId: number) {
    this.phaseModifier = true;
    if (ndfId) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if (ndfEntry.id == ndfId) {
          this.currentNdfEntry = ndfEntry;
        };
      })
      //this.currentNdfEntryId=ndfId;
    }
    this.ndfEntryToggle = true;
    this.modification = true;
  }

  openModalDelete(template: TemplateRef<any>, ndfEntryId: number) {

    if (ndfEntryId) {
      this.noteDeFraisTab.find((ndfEntry) => {
        if(ndfEntry.id == ndfEntryId){
          this.currentNdfEntry = ndfEntry;
        };});
      this.ndfEntryIdToDelete = ndfEntryId;
      this.modalRef = this.modalService.show(template, {
            backdrop: true,
            ignoreBackdropClick: true,
            class: 'modal-sm'
       });
    }
  }

  confirm() {
    this.deleteNdf();
    this.modalRef.hide();
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



}


