import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Patient} from '../doamain/Patient';
import {PatientService} from '../services/patient.service';
import {PatientSearchParameters} from '../services/PatientSearchParameters';
import {Sort} from "@angular/material/sort";
import {PagingParameters} from "../services/PagingParameters";

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];
  _params: PatientSearchParameters & PagingParameters;
  get params() {
    return this._params;
  }

  @Input('params')
  set params(params: PatientSearchParameters & PagingParameters) {
    if (JSON.stringify(this._params) !== JSON.stringify(params)) {
      this._params = params;
      this.patientService.getPatientsPage(params)
        .subscribe(page => this.patients = page.content);
    }
  }

  @Output() paramsChange = new EventEmitter<PatientSearchParameters & PagingParameters>();

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
  }

  onSortChange(sort: Sort) {
    let newParams = {
      ...this.params,
      sort: `${sort.active},${sort.direction}`
    };

    if (sort.direction == '') {
      delete newParams.sort;
    }

    this.params = newParams;

    this.paramsChange.emit(newParams);
  }
}
