import { Component, OnInit } from '@angular/core';

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

      <li class="nav-item">


      <!-- Fonctionnalités supplémentaires selon les droits d'accès de l'utilisateur -->

      <ng-container [ngSwitch]="">

  <ng-container *ngSwitchCase="isAdmin == true"><a class="nav-link" href="#">Nature de missions</a></ng-container>
  <ng-container *ngSwitchCase="isManager == true"><a class="nav-link" href="#">Validation des missions</a></ng-container>
  <ng-container *ngSwitchDefault></ng-container>
</ng-container>


        </li>

    </ul>
  </div>

</nav>

  `,
  styles: []
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
