import { Observable } from 'rxjs';

/**
 * Collègue utilisateur de l'application.
 */
export class Collegue {
  nom:string;
  prenom:string;
  email:string;
  motDePasse:string;
  roles:string[];

  constructor(params:any) {
    Object.assign(this, params);
  }

  estAnonyme():boolean {
    return this.email == undefined;
  }

  isAdmin(role:string): Observable<boolean> {
    return;
  }


  isManager(role:string): Observable<boolean> {
  return;
  }

}
