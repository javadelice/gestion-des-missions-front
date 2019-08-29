import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MissionsService {

  constructor(private httpClient: HttpClient) { }

  getMissions(idCollegueConnecte: number):Observable<MissionDto[]> {
    return this.httpClient.get<MissionDto[]>(environment.baseUrl + 'missions?id=' + idCollegueConnecte, {withCredentials: true});
  }

  deleteMission(idMission: number) {
    return this.httpClient.delete(environment.baseUrl + 'missions?id=' + idMission, {withCredentials: true});
  }

  traitementNuit() {
    return this.httpClient.get(environment.baseUrl + 'update', {withCredentials: true});
  }
}
