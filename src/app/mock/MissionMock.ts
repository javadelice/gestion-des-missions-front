import { Mission } from '../note-de-frais/notes-de-frais.domains';

export class MissionsMock {

  public missionsMock: Mission[] = null;


  constructor() {
    this.missionsMock = [
      /*
      new Mission(new Date("2017-05-22"), new Date("2017-05-26"),"Conseil", "Nantes", "Lyon", "Avion", 10),
      new Mission(new Date("2017-10-02"), new Date("2017-06-10"),"Formation", "Nantes", "Rennes", "Avion", 0),
      new Mission(new Date("2017-11-13"), new Date("2019-11-17"),"Expertise technique", "Nantes", "Nantes", "Voiture de service", 30),
      new Mission(new Date("2018-01-02"), new Date("2019-08-21"),"Conseil", "Lyon", "Montpellier", "Voiture de service", 60)
    */
    ];}

  getList(): Mission[] {
    return this.missionsMock;
  }
}
