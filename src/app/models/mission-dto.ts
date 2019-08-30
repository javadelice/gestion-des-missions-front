import { NatureDto } from './nature-dto';
import { CollegueDto } from './collegue-dto';
import { NdfCumul} from '../note-de-frais/note-de-frais.domains'

export class MissionDto {
  constructor(public id:number,
    public startDate:string,
    public endDate:string,
    public nature:NatureDto,
    public villeDepart:string,
    public villeArrivee:string,
    public transport:string,
    public statut:string,
    public prime: number,
    public collegue:CollegueDto,
    public ndfCumul:NdfCumul) {}
}
