import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValiderMissionsService {

  constructor(private httpClient: HttpClient) { }

  getMissionsAValider(): Observable<MissionDto[]> {
    return this.httpClient.get<MissionDto[]>(environment.baseUrl + 'valider', {withCredentials: true});
  }

  validerMission(isValidated: boolean, mission: MissionDto): Observable<MissionDto> {
    return this.httpClient.patch<MissionDto>(environment.baseUrl + 'valider?isValidated=' + isValidated, mission, {withCredentials: true});
  }

}
