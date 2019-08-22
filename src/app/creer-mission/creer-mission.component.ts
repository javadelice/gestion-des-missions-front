import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MissionDto } from '../models/mission-dto';
import { NatureDto } from '../models/nature-dto';
import { CollegueDto } from '../models/collegue-dto';
import { CreerMissionService } from './creer-mission.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-creer-mission',
  templateUrl: './creer-mission.component.html',
  styleUrls: ['./creer-mission.component.css'],
  providers: [DatePipe]
})
export class CreerMissionComponent implements OnInit {

  dateCourante = new Date();
  // today = new Date().toJSON().split('T')[0];
  today = '2019-08-22';

  listeNatures: NatureDto[];

  isError: boolean;

  mission = new MissionDto(0, new Date(), new Date(), null, '', '', '', '', null);

  constructor(private datePipe: DatePipe, private creerMissionService: CreerMissionService, private _authSrv: AuthService) {
  }

  ngOnInit() {
    this.creerMissionService.getNatures().subscribe(natures => {
      this.listeNatures = natures;
      this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
        this.mission.collegue = collegueConnecte;
      }, (error: HttpErrorResponse) => {});
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

}
