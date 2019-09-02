import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MissionDto } from '../models/mission-dto';
import { ModifierMissionService } from './modifier-mission.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NatureDto } from '../models/nature-dto';
import { CreerMissionService } from '../creer-mission/creer-mission.service';

@Component({
  selector: 'app-modifier-mission',
  templateUrl: './modifier-mission.component.html',
  styleUrls: ['./modifier-mission.component.css']
})
export class ModifierMissionComponent implements OnInit {

  @Input() missionId: number;
  @Output() finModifier: EventEmitter<boolean> = new EventEmitter<boolean>();

  mission: MissionDto;
  listeNatures: NatureDto[];
  modifierOk: boolean;
  isError: boolean;
  erreur: string;
  currentDate = new Date();

  constructor(private creerMissionService: CreerMissionService, private modifierMissionService: ModifierMissionService) { }

  ngOnInit() {
    this.modifierMissionService.getMission(this.missionId).subscribe(mission => {
      this.mission = mission;
      this.mission.nature = null;
      this.isError = false;
      this.modifierOk = false;
      this.creerMissionService.getNatures().subscribe(natures => {
        this.listeNatures = natures;
      }, (error: HttpErrorResponse) => {
        this.isError = true;
        this.erreur = error.status + ' - ' + error.message;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
      this.erreur = error.status + ' - ' + error.message;
    });
  }

  modifier() {
    this.modifierMissionService.modifyMission(this.mission).subscribe(mission => {
      this.modifierOk = true;
      this.isError = false;
    }, (error: HttpErrorResponse) => {
      this.modifierOk = false;
      this.isError = true;
      this.erreur = error.error;
    });
  }

  recommencer() {
    this.ngOnInit();
  }

  valider() {
    this.finModifier.emit(true);
  }

  annuler() {
    this.finModifier.emit(true);
  }

}
