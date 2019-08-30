import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrimesService {

  private subPrimes = new Subject<number[]>();
  publier(primes: number[]) {
    this.subPrimes.next(primes);
  }
  abonnement(): Observable<number[]> {
    return this.subPrimes.asObservable();
  }

  constructor(private httpClient: HttpClient) { }

  getMissionsEchues(idCollegue: number): Observable<MissionDto[]> {
    return this.httpClient.get<MissionDto[]>(environment.baseUrl + 'missionsechues?idCollegue=' + idCollegue, {withCredentials: true});
  }
}
