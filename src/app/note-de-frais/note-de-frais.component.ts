import { Component, OnInit } from '@angular/core';
//import {MatDialog} from '@angular/material/dialog';
import { MissionDto } from '../models/mission-dto';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MissionsService } from '../missions/missions.service';
import { NdfService } from './note-de-frais.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-note-de-frais',
  templateUrl: './note-de-frais.component.html',
  styleUrls: ['./note-de-frais.component.css']
})
export class NoteDeFraisComponent implements OnInit {
  missions:MissionDto[];
  frais:number[];
  currentDate=new Date();
  phaseModifier:Boolean;
  error:boolean;
  modalRef: BsModalRef;
  ndfvisu:boolean;
  missionChosen:MissionDto;

  constructor(private _authSrv:AuthService, private missionService:MissionsService, private _ndfService:NdfService, private _router:Router){} //public dialog: MatDialog) { }

  ngOnInit() {


      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this.missionService.getMissions(collegueConnecte.id).subscribe((missions: MissionDto[]) => {
          this.missions = missions;
          this.phaseModifier = false;
        }, (error: HttpErrorResponse) => {
          this.error = true;
        })

  })
}

ajoutNdf(mission){
this.ndfvisu=true;
this.missionChosen=mission;
}

  openDialog(mission:MissionDto):void{
   // this._ndfService.publier(mission);


    /*
    const dialogRef = this.dialog.open(ModifierNoteDeFraisComponent), {
      width: '250px',
      data: {date: this.date, nature: this.nature, montant: this.montant}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });

  }*/
  }


  exportToPDF():void{
    //TODO
  }

}
