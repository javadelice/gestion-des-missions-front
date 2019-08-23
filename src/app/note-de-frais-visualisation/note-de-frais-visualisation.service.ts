import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay, map, tap} from "rxjs/operators";

import { MissionsMock } from '../mock/MissionMock';
import { NdfEntryDto } from './note-de-frais-visualisation.domain';
import { Mission, NdfDto } from '../note-de-frais/note-de-frais.domains';


/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NdfEntryDtoService {

private mission: Subject<Mission[]>
private NdfDto: Subject<NdfDto>
private NdfEntriesDto: Subject<NdfEntryDto>

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

getNdfDtoFromMissionId (id:number):Observable<NdfDto[]> {
  return this._http
      .get<NdfDto[]>(`${environment.baseUrl}${environment.apiNoteDeFraisFromId}`+'/'+id, {withCredentials: true})
    }



}
