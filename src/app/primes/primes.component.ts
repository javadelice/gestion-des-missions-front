import { Component, OnInit } from '@angular/core';
import { PrimesService } from './primes.service';
import { MissionDto } from '../models/mission-dto';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-primes',
  templateUrl: './primes.component.html',
  styleUrls: ['./primes.component.css']
})
export class PrimesComponent implements OnInit {

  idCollegueConnecte: number;
  missionsEchues: MissionDto[];
  anneePrimes: number = new Date().getFullYear();
  lastAnneePrimes: number = new Date().getFullYear();
  anneesPrimes: number[];
  moisPrimes: { mois: number; prime: number }[];

  primes: number[];

  isError: boolean;

  constructor(private primesService: PrimesService, private _authServ: AuthService, private _fileSaverService: FileSaverService) { }

  ngOnInit() {
    this.anneesPrimes = [];
    this._authServ.collegueConnecteObs.subscribe(collegueConnecte => {
      this.idCollegueConnecte = collegueConnecte.id;
      this.primesService.getMissionsEchues(this.idCollegueConnecte).subscribe(missions => {
        for (const mission of missions) {
          if (!this.anneesPrimes.includes(new Date(mission.endDate).getFullYear())) {
            this.anneesPrimes.push(new Date(mission.endDate).getFullYear());
          }
        }
        this.anneesPrimes.sort().reverse();
        this.anneePrimes = this.anneesPrimes[0];
      }, (error: HttpErrorResponse) => {
        this.isError = true;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });

    this.initData();
  }

  initData() {
    this.missionsEchues = [];
    this.primes = [];
    this.moisPrimes = [{ mois: 0, prime: 0 }, { mois: 1, prime: 0 }, { mois: 2, prime: 0 }, { mois: 3, prime: 0 },
    { mois: 4, prime: 0 }, { mois: 5, prime: 0 }, { mois: 6, prime: 0 }, { mois: 7, prime: 0 },
    { mois: 8, prime: 0 }, { mois: 9, prime: 0 }, { mois: 10, prime: 0 }, { mois: 11, prime: 0 }];

    this._authServ.collegueConnecteObs.subscribe(collegueConnecte => {
      this.idCollegueConnecte = collegueConnecte.id;
      this.primesService.getMissionsEchues(this.idCollegueConnecte).subscribe(missions => {
        for (const mission of missions) {
          if (new Date(mission.endDate).getFullYear() === this.anneePrimes) {
            this.missionsEchues.push(mission);
          }

          for (const obj of this.moisPrimes) {
            if (obj.mois === new Date(mission.endDate).getMonth() && this.anneePrimes === new Date(mission.endDate).getFullYear()) {
              obj.prime += mission.prime;
            }
          }
        }
        for (const obj of this.moisPrimes) {
          this.primes.push(obj.prime);
        }
        this.primesService.publier(this.primes);
      }, (error: HttpErrorResponse) => {
        this.isError = true;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

  downloadCsv() {
    let fichier = '"Date de début","Date de fin","Nature","Prime (€)"\n';
    for (const mission of this.missionsEchues) {
      fichier += `"${mission.startDate}","${mission.endDate}","${mission.nature.code}","${mission.prime}"\n`;
    }
    this._fileSaverService.save(new Blob(["\ufeff", fichier]), `${this.anneePrimes}.csv`);
  }

  selectUpdate() {
    if (this.anneePrimes !== this.lastAnneePrimes) {
      this.initData();
      this.lastAnneePrimes = this.anneePrimes;
    }
  }
}
