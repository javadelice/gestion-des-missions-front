import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay, map, tap, publishReplay} from "rxjs/operators";
import { NdfDto, NdfCumul } from './note-de-frais.domains';
import { MissionDto } from '../models/mission-dto';
import { NdfEntryDto } from '../note-de-frais-visualisation/note-de-frais-visualisation.domains';



/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NdfService {

private missions: Subject<MissionDto[]>
private ndfDto: Subject<NdfDto>
private ndfEntryDtoTab: Subject<NdfEntryDto[]>

private mission: Subject<MissionDto>

@Input() NdfId: number;
@Output() finModifier: EventEmitter<boolean> = new EventEmitter<boolean>();


publier(mission:MissionDto){
  this.mission.next(mission);
}

get missionObs(): Observable <MissionDto>{
  return this.mission.asObservable();
}
  get missionsObs(): Observable <MissionDto[]>{
    return this.missions.asObservable();
  }

  get NdfDtoTabObs() : Observable<NdfEntryDto[]>{
    return this.ndfEntryDtoTab.asObservable();
  }

  get NdfDtoObs() : Observable<NdfDto>{
    return this.ndfDto.asObservable();
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
listMission():Observable<MissionDto[]> {
  return this._http
      .get<MissionDto[]>(`${environment.baseUrl}${environment.apiMissions}`, {withCredentials: true})
      ;
}

getNdfEntriesFromMissionId (missionId:number):Observable<NdfEntryDto[]> {
  return this._http
    .get<NdfEntryDto[]>(`${environment.baseUrl}${environment.apiLignesDeFraisFromMissionId}${missionId}`, {withCredentials: true})
    }

getNdfEntriesFromNdfId (id:number):Observable<NdfEntryDto[]> {
  return this._http
      .get<NdfEntryDto[]>(`${environment.baseUrl}${environment.apiLignesDeFraisFromNdfId}`+id, {withCredentials: true})
    }


createNdfEntry(ndfEntry: NdfEntryDto): Observable<NdfEntryDto>{
 return this._http
  .post<NdfEntryDto>(`${environment.baseUrl}${environment.apiLignedefrais}`, ndfEntry,  {withCredentials: true})
}

modifyNdfEntry(ndfEntry: NdfEntryDto): Observable<NdfEntryDto> {
  return this._http
    .patch<NdfEntryDto>(`${environment.baseUrl}${environment.apiLignedefrais}`, ndfEntry, {withCredentials: true});
}

deleteNdfEntry(ndfEntryId:number){
return this._http
  .delete(`${environment.baseUrl}${environment.apiDeleteLigneDeFrais}`+ndfEntryId, {withCredentials:true});
}

createNdf(ndfCumul: NdfCumul): Observable<NdfCumul> {
  return this._http.post<NdfCumul>(`${environment.baseUrl}${environment.apiCreateNoteDeFrais}`, ndfCumul, {withCredentials: true});
}

}
