import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TechComponent } from './tech/tech.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthComponent } from './auth/auth.component';
import { FormsModule} from '@angular/forms';
import { StatutConnecteService } from './auth/statut-connecte.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MissionsComponent } from './missions/missions.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component';
import { ModifierMissionComponent } from './modifier-mission/modifier-mission.component';
import { NatureMissionComponent } from './nature-mission/nature-mission.component';
import { ValiderMissionsComponent } from './valider-missions/valider-missions.component';
import { PlanningMissionsComponent } from './planning-missions/planning-missions.component';
import { NoteDeFraisVisualisationComponent } from './note-de-frais-visualisation/note-de-frais-visualisation.component';
import { NoteDeFraisComponent } from './note-de-frais/note-de-frais.component';
import { NoteDeFraisAjoutComponent } from './note-de-frais-ajout/note-de-frais-ajout.component';
import { PrimesComponent } from './primes/primes.component';
import { PrimesGraphiqueComponent } from './primes-graphique/primes-graphique.component';
import { ChartsModule } from 'ng2-charts';
import { FileSaverModule } from 'ngx-filesaver';
import { NoteDeFraisMissionComponent } from './note-de-frais-mission/note-de-frais-mission.component';

const routes: Routes = [
  { path: 'tech', component: TechComponent, canActivate: [StatutConnecteService]}, // /tech accessible uniquement si connecté
  { path: 'menu', component: MenuComponent, canActivate: [StatutConnecteService]},
  { path: 'planning', component: PlanningMissionsComponent, canActivate: [StatutConnecteService]},
  { path: 'notesdefrais', component: NoteDeFraisComponent, canActivate:[StatutConnecteService]},
  { path: 'notesdefrais/:idMission', component: NoteDeFraisMissionComponent, canActivate: [StatutConnecteService]},
  { path: 'missions', component: MissionsComponent, canActivate:[StatutConnecteService]}, // /missions accessible ssi connecté
  { path: 'missions/creer', component: CreerMissionComponent, canActivate: [StatutConnecteService]},
  { path: 'nature', component: NatureMissionComponent, canActivate: [StatutConnecteService]},
  { path: 'valider', component: ValiderMissionsComponent, canActivate: [StatutConnecteService]},
  { path: 'primes', component: PrimesComponent, canActivate: [StatutConnecteService]},
  { path: 'connexion', component: AuthComponent},
  { path: '', redirectTo: '/missions', pathMatch: 'full'},

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
    NatureMissionComponent,
    ModifierMissionComponent,
    ValiderMissionsComponent,
    PlanningMissionsComponent,
    NoteDeFraisVisualisationComponent,
    NoteDeFraisAjoutComponent,
    PrimesComponent,
    PrimesGraphiqueComponent,
    NoteDeFraisMissionComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    NgbModule,
    ModalModule.forRoot(),
    CommonModule,
    ChartsModule,
    FileSaverModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
