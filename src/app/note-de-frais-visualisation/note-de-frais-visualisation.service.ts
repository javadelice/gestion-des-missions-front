import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay, map, tap} from "rxjs/operators";
import { MissionDto } from '../models/mission-dto';
import { NdfEntryDto } from './note-de-frais-visualisation.domains';




/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class NdfEntryDtoService {

}
