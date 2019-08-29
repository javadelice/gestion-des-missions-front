import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrimesService {

  constructor(private httpClient: HttpClient) { }

  getMissionsEchuesByAnnee(idCollegue: number, annee: number): Observable<MissionDto[]> {
    return this.httpClient.get<MissionDto[]>(environment.baseUrl + 'missionsechuesannee?idCollegue=' + idCollegue + '&annee=' + annee, {withCredentials: true});
  }

  getMissionsEchues(idCollegue: number): Observable<MissionDto[]> {
    return this.httpClient.get<MissionDto[]>(environment.baseUrl + 'missionsechues?idCollegue=' + idCollegue, {withCredentials: true});
  }
}
