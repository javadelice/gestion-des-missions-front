import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { MissionsService } from '../missions/missions.service';
import { MissionDto } from '../models/mission-dto';
import { ModifierMissionService } from '../modifier-mission/modifier-mission.service';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { NdfEntryDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domains';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as jsPDF from 'jspdf';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-note-de-frais-mission',
  templateUrl: './note-de-frais-mission.component.html',
  styleUrls: ['./note-de-frais-mission.component.css']
})
export class NoteDeFraisMissionComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private missionService:MissionsService,
    private route: ActivatedRoute,
    private modifierMissionService: ModifierMissionService,
    private ndfService: NdfService,
    private bsModalService: BsModalService,
    private titleService:Title) { }

  ndfNature: string[] = ["ACTIVITE", "HOTEL", "PETIT_DEJEUNER", "DEJEUNER", "DINER", "CARBURANT", "TAXI", "TRAIN", "AVION"];

  mission: MissionDto;
  ldfTable: NdfEntryDto[];

  newNdfEntry: NdfEntryDto;
  editedNdfEntry: NdfEntryDto;
  deleteNdfEntry: NdfEntryDto;

  modalRef: BsModalRef;

  errorMsg: string;
  isError: boolean;

  isAllowed:boolean=true;


  ngOnInit() {
    /*
    //Vérification de l'accès avec
     this.authService.collegueConnecteObs.subscribe(collegueConnecte => {
        this.route.paramMap.pipe(flatMap(paramap => {

          this.ndfService.checkAllowance(Number(paramap.get('idMission')), collegueConnecte.id).subscribe();


          this.ndfService.getNdfEntriesFromMissionId(Number(paramap.get('idMission')))
            .subscribe(table => this.ldfTable = table);
          return this.modifierMissionService.getMission(Number(paramap.get('idMission')));


      }))},error => {
        this.errorMsg = error.error;
        this.isError = true;


    this.route.paramMap.pipe(flatMap(paramap => {

      this.ndfService.checkAllowance(Number(paramap.get('idMission'), collegueConnecte.id).subscribe();


      this.ndfService.getNdfEntriesFromMissionId(Number(paramap.get('idMission')))
        .subscribe(table => this.ldfTable = table);
      return this.modifierMissionService.getMission(Number(paramap.get('idMission')));
    }))
      .subscribe(mission => {
        this.mission = mission;
      });
    this.isError = false;
  })

}
    */
    this.route.paramMap.pipe(flatMap(paramap => {
      this.ndfService.getNdfEntriesFromMissionId(Number(paramap.get('idMission')))
        .subscribe(table => {
          if(table != undefined){
            this.ldfTable = table;}});
      return this.modifierMissionService.getMission(Number(paramap.get('idMission')));
    }))
      .subscribe(mission => {
        this.mission = mission;
      });
    this.isError = false;
    }

  generatePDF(idMission: number) {
    if (this.ldfTable) {
      const doc = new jsPDF();
      doc.autoTable({ html: '#tableLignesDeFrais' });
      doc.save('mission' + idMission + '-' + 'Note-de-frais' + '.pdf');
    }

  }

  edit(editTemplate: TemplateRef<any>, ndfEntry: NdfEntryDto) {
    this.isError = false;
    this.editedNdfEntry = { ...ndfEntry };
    this.modalRef = this.bsModalService.show(editTemplate,  {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-md'
    });
  }

  delete(deleteTemplate: TemplateRef<any>, ndfEntry: NdfEntryDto) {
    this.isError = false;
    this.deleteNdfEntry = { ...ndfEntry };
    this.modalRef = this.bsModalService.show(deleteTemplate,  {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    });
  }

  create(createTemplate: TemplateRef<any>) {
    this.isError = false;
    this.newNdfEntry = new NdfEntryDto(0, new Date(), '', 0, this.mission.id);
    this.modalRef = this.bsModalService.show(createTemplate,  {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-md'
    });
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
  confirmDelete() {
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
