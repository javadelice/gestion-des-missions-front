import { Time } from '@angular/common';
import { MissionDto } from '../models/mission-dto';

/**
 * Modélisation d'un lien Backend : nom et lien.
 */


export class NdfDto {
  [x: string]: any;
    public id:number;
    public dateDebut:Date;
    public dateFin:Date;
    public nature:string;
    public depart:string;
    public arrivee:string;
    public transport:string;
    public frais:number
    constructor(params:any) {
      Object.assign(this, params);
    }
}

export class NdfCumul {
  id: number;
  mission: MissionDto;
}

