import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay, map, tap} from "rxjs/operators";
import { Mission, NoteDeFrais } from './note-de-frais.domains';
import { MissionsMock } from '../mock/MissionMock';
import { NdfDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domain';


/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NoteDeFraisService {

private mission: Subject<Mission[]>
private noteDeFrais: Subject<NoteDeFrais>

  get missionsObs(): Observable <Mission[]>{
    return this.mission.asObservable();
  }

  get noteDeFraisObs() : Observable<NoteDeFrais>{
    return this.noteDeFrais.asObservable();
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

getNoteDeFraisFromMissionId (id:number):Observable<NdfDto[]> {
  return this._http
      .get<NdfDto[]>(`${environment.baseUrl}${environment.apiNoteDeFrais}`+'/'+id, {withCredentials: true})
    }



}
