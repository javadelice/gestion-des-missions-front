import { Time } from '@angular/common';

/**
 * Modélisation d'un lien Backend : nom et lien.
 */
export class Mission {

  constructor(
    public dateDebut:Date,
    public dateFin:Date,
    public nature:string,
    public depart:string,
    public arrivee:string,
    public transport:string,
    public frais:number
    ) {}
}
