import { Time } from '@angular/common';

/**
 * Modélisation d'un lien Backend : nom et lien.
 */
export class Mission {
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

export class NoteDeFrais {
  [x: string]: any;



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