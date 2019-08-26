import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NatureDto } from '../models/nature-dto';
import { environment } from 'src/environments/environment';
import { MissionDto } from '../models/mission-dto';

@Injectable({
  providedIn: 'root'
})
export class CreerMissionService {

  constructor(private httpClient: HttpClient) { }

  getNatures(): Observable<NatureDto[]> {
    return this.httpClient.get<NatureDto[]>(environment.baseUrl + 'natures', {withCredentials: true});
  }

  createMission(mission: MissionDto): Observable<MissionDto> {
    return this.httpClient.post<MissionDto>(environment.baseUrl + 'missions', mission, {withCredentials: true});
  }
}
