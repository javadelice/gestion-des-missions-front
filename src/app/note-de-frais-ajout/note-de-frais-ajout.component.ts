import { Component, OnInit, Input } from '@angular/core';
import { NdfEntryDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domains';
import { NatureDto } from '../models/nature-dto';
import { MissionDto } from '../models/mission-dto';
import { NdfService } from '../note-de-frais/note-de-frais.service';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NdfCumul } from '../note-de-frais/note-de-frais.domains';


@Component({
  selector: 'app-note-de-frais-ajout',
  templateUrl: './note-de-frais-ajout.component.html',
  styleUrls: ['./note-de-frais-ajout.component.css']
})
export class NoteDeFraisAjoutComponent implements OnInit {
  currentDate = new Date();
  newNdfEntry: NdfEntryDto = new NdfEntryDto(0, this.currentDate, "", 0, 0);
  ndfEntries: NdfEntryDto[];
  modifierOk: boolean;
  isError: boolean;
  erreur: string;
  @Input() mission:MissionDto;

  ndfNature:string[]= [ "ACTIVITE",  "HOTEL",  "PETIT_DEJEUNER",  "DEJEUNER",  "DINER",  "CARBURANT",  "TAXI",  "TRAIN",  "AVION"];

  creerOk: boolean;


  constructor(private _ndfService: NdfService, private _authSrv: AuthService) {
  }

  ngOnInit() {
if(this.mission){

}

    this.creerOk = false;
      this.isError = false;
  }

  creer() {
    this._ndfService.createNdfEntry(this.newNdfEntry).subscribe(() => {
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


