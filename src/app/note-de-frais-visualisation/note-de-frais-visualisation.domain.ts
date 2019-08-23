export class NdfEntryDto {
  constructor(
    public dateDebut:Date,
    public dateFin:Date,
    public nature:string,
    public depart:string,
    public arrivee:string,
    public transport:string,
    public frais:number=0) {}
}
