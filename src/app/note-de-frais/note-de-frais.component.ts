import { Component, OnInit } from '@angular/core';
import { NoteDeFraisService } from './notes-de-frais.service';
import { Mission } from './notes-de-frais.domains';
import { MissionsMock } from '../mock/MissionMock';


@Component({
  selector: 'app-note-de-frais',
  templateUrl: './note-de-frais.component.html',
  styleUrls: ['./note-de-frais.component.css']
})
export class NoteDeFraisComponent implements OnInit {
  Missions:Mission[]=[];
  currentDate=new Date();

  constructor(private _NDFsrv: NoteDeFraisService) { }

  ngOnInit() {
    /*this._NDFsrv.listMission().subscribe(
      mission => this.Missions.push(mission));*/
      this.Missions=new MissionsMock().getList();

  }

}
