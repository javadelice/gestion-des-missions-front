import { Collegue } from '../auth/auth.domains';

export class NdfEntryDto {
  constructor(
    public id:number,
    public date:Date,
    public nature:string,
    public montant:number=0,
    public collegue:Collegue,
    public NdfId:number
    ) {}
}

export class NdfNatureDto{
  constructor(
    public conseil:string="Conseil",
    public expertiseTechnique:string="Expertise Technique",
    public formation:string="Formation"
  ) {}
}

