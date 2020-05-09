import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Patient } from '../doamain/Patient';
import { PatientService } from '../services/patient.service';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { PagingParameters } from '../services/PagingParameters';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

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

      if (!params.sort) {
        this.matSort.sort({ id: '', start: 'asc', disableClear: false });
      }
    }
  }

  @Output() paramsChange = new EventEmitter<PatientSearchParameters & PagingParameters>();

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    if (this.params.sort) {
      const sortParams = this.params.sort.split(',');
      const id = sortParams[0];
      const start = (sortParams[1] === 'asc') ? 'asc' : 'desc';
      this.matSort.sort({ id, start } as MatSortable);
    }
  }

  onSortChange(sort: Sort) {
    const newParams = {
      ...this.params,
      sort: `${sort.active},${sort.direction}`
    };

    if (!sort.active || sort.direction === '') {
      delete newParams.sort;
    }

    this.params = newParams;

    this.paramsChange.emit(newParams);
  }
}
