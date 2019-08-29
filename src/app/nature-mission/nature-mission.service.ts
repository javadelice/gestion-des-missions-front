import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NatureDto } from '../models/nature-dto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NatureMissionService {

  constructor(private httpClient:HttpClient) { }

  recupNature(idCollegueConnecte:number):Observable<NatureDto[]> {
    return this.httpClient.get<NatureDto[]>(environment.baseUrl + 'nature?id=' + idCollegueConnecte, {withCredentials:true});
  }

  modifyNature(nature: NatureDto): Observable<NatureDto> {
    return this.httpClient.patch<NatureDto>(environment.baseUrl + 'nature', nature, {withCredentials: true});
  }

  deleteNature(idNature:number) {
    return this.httpClient.delete(environment.baseUrl + 'nature?id=' + idNature, {withCredentials:true});
  }
}
