import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  template: `
<!--Navbar-->
<mdb-navbar SideClass="navbar navbar-expand-lg navbar-dark unique-color mt-2" [containerInside]="false">

  <!-- Collapsible content -->
  <links>

    <!-- Links -->
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="tech">Accueil<span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="missions">Gestion des missions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="planning">Planning des missions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="primes">Primes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="notesdefrais">Saisie note de frais</a>
      </li>
      <li class="nav-item" *ngIf="isAdmin == true">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="nature">Nature de missions</a>
      </li>
      <li class="nav-item" *ngIf="isManager == true">
        <a class="nav-link waves-light" mdbWavesEffect routerLink="valider">Validation des missions</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto nav-flex-icons">
      <li class="nav-item">
        <span class="navbar-text white-text">Bonjour {{(collegueConnecte | async).nom}} {{(collegueConnecte | async).prenom}}</span>
      </li>
      <li class="nav-item">
        <a class="nav-link">
          <div class="btn-group" mdbDropdown>
            <mdb-icon fas icon="user" mdbDropdownToggle></mdb-icon>
            <div class="dropdown-menu dropdown-menu-right dropdown-primary">
              <a class="dropdown-item" (click)="seDeconnecter()">Se déconnecter</a>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </links>
  <!-- Collapsible content -->

</mdb-navbar>
<!--/.Navbar-->

  `,
  styles: []
})
export class MenuComponent implements OnInit {

  isAdmin: boolean;
  isManager: boolean;
  collegueConnecte: Observable<Collegue>;

  constructor(private _authSrv: AuthService, private _router: Router) { }

  ngOnInit() {
    this.collegueConnecte = this._authSrv.collegueConnecteObs;
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {

      if (collegueConnecte && collegueConnecte.email) {
        if (collegueConnecte.roles.includes('ROLE_ADMINISTRATEUR')) {

          if (collegueConnecte.roles !== undefined && collegueConnecte.roles.includes('ROLE_ADMINISTRATEUR')) {
            this.isAdmin = true;
          }
          if (collegueConnecte.roles !== undefined && collegueConnecte.roles.includes('ROLE_MANAGER')) {
            this.isManager = true;
          }

      }

      }
    }, (error: HttpErrorResponse) => {
  });

  seDeconnecter() {
    this._authSrv.seDeconnecter().subscribe(
      value => this._router.navigate(['/connexion'])
    );
  }

}
  }
