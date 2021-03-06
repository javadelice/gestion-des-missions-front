import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MissionDto } from '../models/mission-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  constructor(private httpClient: HttpClient) { }

  getMission(idMission: number): Observable<MissionDto> {
    return this.httpClient.get<MissionDto>(environment.baseUrl + 'mission?idMission=' + idMission, {withCredentials: true});
  }
}
