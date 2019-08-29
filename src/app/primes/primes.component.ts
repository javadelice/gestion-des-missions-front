import { Component, OnInit } from '@angular/core';
import { PrimesService } from './primes.service';
import { MissionDto } from '../models/mission-dto';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-primes',
  templateUrl: './primes.component.html',
  styleUrls: ['./primes.component.css']
})
export class PrimesComponent implements OnInit {

  idCollegueConnecte: number;
  missionsEchues: MissionDto[];
  anneePrimes: number = new Date().getFullYear();
  anneesPrimes: number[];
  moisPrimes = [{mois: 0, prime: 0}, {mois: 1, prime: 0}, {mois: 2, prime: 0}, {mois: 3, prime: 0}, {mois: 4, prime: 0}, {mois: 5, prime: 0},
    {mois: 6, prime: 0}, {mois: 7, prime: 0}, {mois: 8, prime: 0}, {mois: 9, prime: 0}, {mois: 10, prime: 0}, {mois: 11, prime: 0}];

  primes: number[];

  isError: boolean;

  constructor(private primesService: PrimesService, private _authServ: AuthService) { }

  ngOnInit() {
    this.missionsEchues = [];
    this.anneesPrimes = [];
    this.primes = [];
    this.moisPrimes = [{mois: 0, prime: 0}, {mois: 1, prime: 0}, {mois: 2, prime: 0}, {mois: 3, prime: 0}, {mois: 4, prime: 0}, {mois: 5, prime: 0},
      {mois: 6, prime: 0}, {mois: 7, prime: 0}, {mois: 8, prime: 0}, {mois: 9, prime: 0}, {mois: 10, prime: 0}, {mois: 11, prime: 0}];

    this._authServ.collegueConnecteObs.subscribe(collegueConnecte => {
      this.idCollegueConnecte = collegueConnecte.id;
      this.primesService.getMissionsEchues(this.idCollegueConnecte).subscribe(missions => {
        for (const mission of missions) {
          if (new Date(mission.endDate).getFullYear() === this.anneePrimes) {
            this.missionsEchues.push(mission);
          }
          if (!this.anneesPrimes.includes(new Date(mission.endDate).getFullYear())) {
            this.anneesPrimes.push(new Date(mission.endDate).getFullYear());
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
      }, (error: HttpErrorResponse) => {
        this.isError = true;
      });
    }, (error: HttpErrorResponse) => {
      this.isError = true;
    });
  }

}
