import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { TechComponent } from './tech/tech.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthComponent } from './auth/auth.component';
import {FormsModule} from '@angular/forms';
import {StatutConnecteService} from './auth/statut-connecte.service';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MissionsComponent } from './missions/missions.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component';
import { ModifierMissionComponent } from './modifier-mission/modifier-mission.component';
import { NoteDeFraisVisualisationComponent } from './note-de-frais-visualisation/note-de-frais-visualisation.component';
import { NoteDeFraisComponent } from './note-de-frais/note-de-frais.component';

const routes: Routes = [
  { path:'tech', component: TechComponent, canActivate:[StatutConnecteService]}, // /tech accessible uniquement si connecté
  { path: 'menu', component: MenuComponent, canActivate:[StatutConnecteService]},
  { path:'notesdefrais', component: NoteDeFraisComponent, canActivate:[StatutConnecteService]},
  { path:'ndf-visu', component: NoteDeFraisVisualisationComponent, canActivate:[StatutConnecteService]},
  { path:'missions', component: MissionsComponent, canActivate:[StatutConnecteService]}, // /missions accessible ssi connecté
  { path:'missions/creer', component:CreerMissionComponent, canActivate:[StatutConnecteService]},
  { path:'connexion', component: AuthComponent},
  { path: '', redirectTo: '/tech', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    TechComponent,
    AuthComponent,
    MenuComponent,
    NoteDeFraisComponent,
    MissionsComponent,
    CreerMissionComponent,
    ModifierMissionComponent,
    NoteDeFraisVisualisationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    NgbModule,
    CommonModule,
    ModalModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
