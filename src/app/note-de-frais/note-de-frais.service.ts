import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay, map, tap} from "rxjs/operators";
import { Mission, NdfDto } from './note-de-frais.domains';
import { MissionsMock } from '../mock/MissionMock';


/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NdfService {

private mission: Subject<Mission[]>
private NdfDto: Subject<NdfDto>

  get missionsObs(): Observable <Mission[]>{
    return this.mission.asObservable();
  }

  get NdfDtoObs() : Observable<NdfDto>{
    return this.NdfDto.asObservable();
  }

  constructor(private _http:HttpClient) { }

  /**
   * Récupération d'un flux de liens techniques vers le backend.
   *
   * @returns {Observable<Mission>}
   */

   /* Using MockList
  listMission():Observable<Mission[]> {
    return of(new MissionsMock().getList());
  }
*/
listMission():Observable<Mission[]> {
  return this._http
      .get<Mission[]>(`${environment.baseUrl}${environment.apiMissions}`, {withCredentials: true})
      .pipe(
      );
}

getNdfFromMissionId (missionId:number):Observable<NdfDto[]> {
  return this._http
    .get<NdfDto[]>(`${environment.baseUrl}${environment.apiNoteDeFraisFromMissionId}`+missionId, {withCredentials: true})
    }

getNdfFromId (id:number):Observable<NdfDto[]> {
  return this._http
      .get<NdfDto[]>(`${environment.baseUrl}${environment.apiNoteDeFraisFromId}`+'/'+id, {withCredentials: true})
    }



}
