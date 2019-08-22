import { Component, OnInit } from '@angular/core';
import { NoteDeFraisService } from './notes-de-frais.service';
import { Mission } from './notes-de-frais.domains';
import { MissionsMock } from '../mock/MissionMock';
//import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-note-de-frais',
  templateUrl: './note-de-frais.component.html',
  styleUrls: ['./note-de-frais.component.css']
})
export class NoteDeFraisComponent implements OnInit {
  missions:Mission[]=[];
  currentDate=new Date();

  constructor(private _NDFsrv: NoteDeFraisService, ){} //public dialog: MatDialog) { }

  ngOnInit() {
    this._NDFsrv.listMission().subscribe(
      mission => this.missions=mission);
     // this.Missions=new MissionsMock().getList();

  }

  openDialog():void{
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
