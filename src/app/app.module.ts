import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { TechComponent } from './tech/tech.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthComponent } from './auth/auth.component';
import { FormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { StatutConnecteService } from './auth/statut-connecte.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './menu/menu.component';
import { MissionsComponent } from './missions/missions.component';
import { CreerMissionComponent } from './creer-mission/creer-mission.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModifierMissionComponent } from './modifier-mission/modifier-mission.component';
import { NatureMissionComponent } from './nature-mission/nature-mission.component';
import { ValiderMissionsComponent } from './valider-missions/valider-missions.component';

const routes: Routes = [
  { path: 'tech', component: TechComponent, canActivate: [StatutConnecteService]},
  { path: 'menu', component: MenuComponent, canActivate: [StatutConnecteService]},
  { path: 'missions', component: MissionsComponent, canActivate: [StatutConnecteService]},
  { path: 'missions/creer', component: CreerMissionComponent, canActivate: [StatutConnecteService]},
  { path: 'valider', component: ValiderMissionsComponent, canActivate: [StatutConnecteService]},
  { path: 'connexion', component: AuthComponent},
  { path: '', redirectTo: '/tech', pathMatch: 'full'},
  { path:'nature', component:NatureMissionComponent, canActivate:[StatutConnecteService]}
];


@NgModule({
  declarations: [
    AppComponent,
    TechComponent,
    AuthComponent,
    MenuComponent,
    MissionsComponent,
    CreerMissionComponent,
    NatureMissionComponent,
    ModifierMissionComponent,
    ValiderMissionsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    NgbModule,
    ModalModule.forRoot(),
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
