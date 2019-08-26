import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NdfEntryDto } from './note-de-frais-visualisation.domain';
import { HttpErrorResponse } from '@angular/common/http';
import { NdfService } from '../note-de-frais/note-de-frais.service';


@Component({
  selector: 'app-note-de-frais-visualisation',
  templateUrl: './note-de-frais-visualisation.component.html',
  styleUrls: ['./note-de-frais-visualisation.component.css']
})
export class NoteDeFraisVisualisationComponent implements OnInit {
  noteDeFraisTab:NdfEntryDto[]=[];
  missionId:number=3;
  currentDate=new Date();
  phaseModifier:Boolean;
  error:boolean;

  constructor(private _authSrv:AuthService, private _ndfSrv:NdfService, private _router:Router){} //public dialog: MatDialog) { }

  ngOnInit() {
    this.missionId=1;
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this._ndfSrv.getNdfFromMissionId(this.missionId).subscribe((noteDeFraisTab: NdfEntryDto[]) => {
          this.noteDeFraisTab = noteDeFraisTab;
          this.phaseModifier = false;
        }, (error: HttpErrorResponse) => {
          this.error = true;
        })

  })
}

}
