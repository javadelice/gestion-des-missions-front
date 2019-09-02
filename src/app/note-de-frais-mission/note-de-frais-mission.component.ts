import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { MissionsService } from '../missions/missions.service';
import { MissionDto } from '../models/mission-dto';
import { ModifierMissionService } from '../modifier-mission/modifier-mission.service';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { NdfEntryDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domains';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-note-de-frais-mission',
  templateUrl: './note-de-frais-mission.component.html',
  styleUrls: ['./note-de-frais-mission.component.css']
})
export class NoteDeFraisMissionComponent implements OnInit {

  constructor(private route: ActivatedRoute,
     private modifierMissionService: ModifierMissionService,
      private ndfService: NdfService,
      private bsModalService: BsModalService) { }

  ndfNature: string[] = ["ACTIVITE", "HOTEL", "PETIT_DEJEUNER", "DEJEUNER", "DINER", "CARBURANT", "TAXI", "TRAIN", "AVION"];

  mission: MissionDto;
  ldfTable: NdfEntryDto[];

  newNdfEntry: NdfEntryDto;
  editedNdfEntry: NdfEntryDto;
  deleteNdfEntry: NdfEntryDto;

  modalRef: BsModalRef;

  errorMsg: string;
  isError: boolean;



  ngOnInit() {
    this.route.paramMap.pipe(flatMap(paramap => {
      this.ndfService.getNdfEntriesFromMissionId(Number(paramap.get('idMission')))
      .subscribe(table => this.ldfTable = table);
      return this.modifierMissionService.getMission(Number(paramap.get('idMission')));
    }))
    .subscribe(mission => {
      this.mission = mission;
    });
    this.isError = false;
  }

  generatePDF(idMission: number) {

  }

  edit(editTemplate: TemplateRef<any>, ndfEntry:NdfEntryDto) {
    this.isError = false;
    this.editedNdfEntry = {... ndfEntry};
    this.modalRef = this.bsModalService.show(editTemplate, {class: 'modal-md'});
  }

  delete(deleteTemplate: TemplateRef<any>, ndfEntry:NdfEntryDto) {
    this.isError = false;
    this.deleteNdfEntry = {... ndfEntry};
    this.modalRef = this.bsModalService.show(deleteTemplate, {class: 'modal-md'});
  }

  create(createTemplate: TemplateRef<any>) {
    this.isError = false;
    this.newNdfEntry = new NdfEntryDto(0, new Date(), '', 0, this.mission.id);
    this.modalRef = this.bsModalService.show(createTemplate, {class: 'modal-md'});
  }

  creerLigneDeFrais() {
    this.ndfService.createNdfEntry(this.newNdfEntry).subscribe(() => {
      this.ngOnInit();
      this.modalRef.hide();
    },
    error => {
      this.errorMsg = error.error;
      this.isError = true;
    });

  }

  cancel() {
    this.modalRef.hide();
  }

  modifierLigneDeFrais() {
    this.ndfService.modifyNdfEntry(this.editedNdfEntry).subscribe(() => {
      this.ngOnInit();
      this.modalRef.hide();
    },
    error => {
      this.errorMsg = error.error;
      this.isError = true;
    });
  }
  confirmDelete(){
    this.ndfService.deleteNdfEntry(this.deleteNdfEntry.id).subscribe(() => {
      this.ngOnInit();
      this.modalRef.hide();
    },
    error => {
      this.errorMsg = error.error;
      this.isError = true;
    });
  }
}
