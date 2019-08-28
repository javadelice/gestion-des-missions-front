import { Component, OnInit, Input } from '@angular/core';
import { NdfEntryDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domains';
import { NatureDto } from '../models/nature-dto';
import { MissionDto } from '../models/mission-dto';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-note-de-frais-ajout',
  templateUrl: './note-de-frais-ajout.component.html',
  styleUrls: ['./note-de-frais-ajout.component.css']
})
export class NoteDeFraisAjoutComponent implements OnInit {

  ndfEntry: NdfEntryDto;
  ndfEntries: NdfEntryDto[];
  modifierOk: boolean;
  isError: boolean;
  erreur: string;
  @Input() currentNdfEntryId:number;
  listeNatures:string[];

  creerOk: boolean;

  mission = new MissionDto(0, '', '', new NatureDto(0, '', '', '', 1, "", '', '', 0), '', '', '', 'INITIALE', null);
  // estimationPrime = 0;
  // difference = (this.mission.endDate.valueOf() - this.mission.startDate.valueOf())/86400000;
  // startD = 10;
  // endD = 0;

  constructor(private _ndfService: NdfService, private _authSrv: AuthService) {
  }

  ngOnInit() {
    this.creerOk = false;
      this.isError = false;
    this.listeNatures=["Conseil", "Expertise Technique","Formation"];
  }

  creer() {
    this._ndfService.createNdfEntry(this.ndfEntry).subscribe(ndfEntry => {
      this.creerOk = true;
      this.isError = false;
    }, (error: HttpErrorResponse) => {
      this.creerOk = false;
      this.isError = true;
      this.erreur = error.error;
    });
  }

  recommencer() {
    this.ngOnInit();
  }

}


