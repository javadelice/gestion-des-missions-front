import { Component, OnInit, TemplateRef } from '@angular/core';
import { NatureDto } from '../models/nature-dto';
import { NatureMissionService } from './nature-mission.service';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nature-mission',
  templateUrl: './nature-mission.component.html',
  styleUrls: ['./nature-mission.component.css']
})
export class NatureMissionComponent implements OnInit {

  natureMissions: NatureDto[];
  error: boolean;
  modalRef: BsModalRef;

  constructor(private natureService: NatureMissionService, private _authSrv: AuthService, private modalService: BsModalService) { }

  ngOnInit() {
    this._authSrv.collegueConnecteObs.subscribe(collegueConnecte => {
      this.natureService.recupNature(collegueConnecte.id).subscribe((natureMissions: NatureDto[]) => {
        this.natureMissions = natureMissions;
      }, (error: HttpErrorResponse) => {
        this.error = true;
      })
    }
      , (error: HttpErrorResponse) => {
        this.error = true;
      });
  }

  openModal(template: TemplateRef<any>, idNature:number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

}
