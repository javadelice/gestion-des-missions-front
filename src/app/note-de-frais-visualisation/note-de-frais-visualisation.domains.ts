import { Collegue } from '../auth/auth.domains';

export class NdfEntryDto {
  constructor(
    public id:number,
    public date:Date,
    public nature:string,
    public montant:number=0,
    public NdfId:number
    ) {}
}

export enum NdfNature{
    ACTIVITE,
    HOTEL,
    PETIT_DEJEUNER,
    DEJEUNER,
    DINER,
    CARBURANT,
    TAXI,
    TRAIN,
    AVION
}

