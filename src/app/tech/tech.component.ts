import { Component, OnInit } from '@angular/core';
import {TechService} from "./tech.service";
import {BackendLink} from "./tech.domains";
import { MissionsService } from '../missions/missions.service';

/**
 * Composant d'affichage d'informations techniques (liens utiles pour connaître l'état du backend).
 *
 * Ce composant permet de valider la communication avec le backend.
 */
@Component({
  selector: 'app-tech',
  template: `
    <mdb-card class="animated zoomIn">
      <mdb-card-header class="primary-color white-text">
        <h4>Informations techniques du backend</h4>
      </mdb-card-header>
      <mdb-card-body>
        <table class="table table-hover table-bordered">
          <thead>
          <tr>
            <th>Nom</th>
            <th>Lien</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let link of links" class="">
            <td>{{link.name}}</td>
            <td><a [href]="link.href">{{link.href}}</a></td>
          </tr>
          <tr>
            <td>Forcer le traitement de nuit</td>
            <td><button class="btn btn-primary btn-sm" (click)="traitementNuit()">Traitement de nuit</button></td>
          </tr>
          </tbody>
        </table>
      </mdb-card-body>
    </mdb-card>
    <mdb-card class="animated zoomIn">
    <div>
    <input type="button" mdbBtn color="warning" sclass="waves-light" mdbWavesEffect value="Note de Frais" [routerLink]="['../notesdefrais/']">
    <input type="button" mdbBtn color="info" sclass="waves-light" mdbWavesEffect value="Missions" [routerLink]="['../missions/']">
    <input type="button" mdbBtn color="success" sclass="waves-light" mdbWavesEffect value="NDF-Visu" [routerLink]="['../ndf-visu/']">
    </div>
    </mdb-card>
  `,
  styles: []
})
export class TechComponent implements OnInit {

  links: BackendLink[] = [];

  constructor(private _techSrv: TechService, private _missionServ: MissionsService) { }

  ngOnInit() {
   this._techSrv.listBackendLinks().subscribe(
     link => this.links.push(link)
   );
  }

  traitementNuit() {
    this._missionServ.traitementNuit().subscribe();
  }

}
