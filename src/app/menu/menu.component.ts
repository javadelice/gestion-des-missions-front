import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  template: `
  <nav class="navbar navbar-light nav justify-content-center" style="background-color: #e3f2fd;">

  <div class="row">
    <ul class="nav justify-content-center">
      <li class="nav-item">
        <a class="nav-link active" href="#">Accueil</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Gestion des missions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Planning des missions</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Primes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Saisie note de frais</a>
      </li>
      <li class="nav-item" *ngIf="isAdmin == true">
        <a class="nav-link" href="#">Nature de missions</a>
      </li>
      <li class="nav-item" *ngIf="isManager == true">
        <a class="nav-link" href="#">Validation des missions</a>
      </li>

    </ul>
  </div>

</nav>

  `,
  styles: []
})
export class MenuComponent implements OnInit {

  isAdmin: boolean;
  isManager: boolean;

  constructor(private _authSrv: AuthService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      if (collegueConnecte.roles.includes('ROLE_ADMINISTRATEUR')) {
        this.isAdmin = true;
      }
      if (collegueConnecte.roles.includes('ROLE_MANAGER')) {
        this.isManager = true;
      }
    }, (error: HttpErrorResponse) => {

    });
  }

}