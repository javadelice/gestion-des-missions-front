import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay} from "rxjs/operators";
import { Mission } from './notes-de-frais.domains';
import { MissionsMock } from '../mock/MissionMock';


/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NoteDeFraisService {

  constructor(private _http:HttpClient) { }

  /**
   * Récupération d'un flux de liens techniques vers le backend.
   *
   * @returns {Observable<Mission>}
   */
  listMission():Observable<Mission[]> {
    return of(new MissionsMock().getList());
  }

}
