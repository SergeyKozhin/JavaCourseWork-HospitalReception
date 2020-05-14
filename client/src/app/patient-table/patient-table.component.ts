import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Patient } from '../doamain/Patient';
import { PatientService } from '../services/patient.service';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { PagingParameters } from '../services/PagingParameters';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PatientFormComponent } from '../forms/patient-form/patient-form.component';
import { MatTable } from '@angular/material/table';
import { SnackbarService } from '../services/snackbar.service';
import { ConfirmationWindowComponent } from '../forms/confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward', 'actions'];
  patients: Patient[];
  _params: PatientSearchParameters & PagingParameters;
  get params() {
    return this._params;
  }

  @Input('params')
  set params(params: PatientSearchParameters & PagingParameters) {
    if (JSON.stringify(this._params) !== JSON.stringify(params)) {
      this._params = params;
      this.updatePatients(params);

      if (!params.sort) {
        this.matSort.sort({ id: '', start: 'asc', disableClear: false });
      }

      if (!params.page) {
        this.paginator.pageIndex = 0;
      }

      if (!params.size) {
        this.paginator.pageSize = 10;
      }

      this.paramsChange.emit(params);
    }
  }

  @Output() paramsChange = new EventEmitter<PatientSearchParameters & PagingParameters>();

  constructor(
    private patientService: PatientService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.params.sort) {
      const sortParams = this.params.sort.split(',');
      const id = sortParams[0];
      const start = (sortParams[1] === 'asc') ? 'asc' : 'desc';
      this.matSort.sort({ id, start } as MatSortable);
    }

    if (this.params.page) {
      this.paginator.pageIndex = parseInt(this.params.page, 10);
    }

    if (this.params.size) {
      this.paginator.pageSize = parseInt(this.params.size, 10);
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
  }

  onPageChange(event: PageEvent) {
    this.params = {
      ...this.params,
      page: event.pageIndex.toString(),
      size: event.pageSize.toString()
    };
  }

  addPatient() {
    const data: {
      diagnosis?: number,
      ward?: number
    } = {};

    if (this.params.diagnosis) {
      const diagnosis = (typeof this.params.diagnosis === 'string') ?
        this.params.diagnosis :
        (this.params.diagnosis.length === 1) ? this.params.diagnosis[0] : '';

      data.diagnosis = parseInt(diagnosis, 10);
    }

    if (this.params.ward) {
      const ward = (typeof this.params.ward === 'string') ?
        this.params.ward :
        (this.params.ward.length === 1) ? this.params.ward[0] : '';

      data.ward = parseInt(ward, 10);
    }

    this.dialog.open(PatientFormComponent, { data })
      .afterClosed()
      .subscribe(patient => {
        if (patient) {
          this.patientService.addPatient(patient)
            .subscribe(_ => {
                this.updatePatients(this.params);
                this.snackbarService.showInfoSnackbar('Patient successfully added');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't add patient: ${error}`));
        }
      });
  }

  deletePatient(patient: Patient) {
    this.dialog.open(ConfirmationWindowComponent, {
      data: `Are you sure you want to delete patient ${patient.firstName} ${patient.lastName}?`
    }).afterClosed()
      .subscribe(confirmation => {
        if (confirmation) {
          this.patientService.deletePatient(patient)
            .subscribe(_ => {
                this.updatePatients(this.params);
                this.snackbarService.showInfoSnackbar('Patient successfully deleted');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't delete patient: ${error}`));
        }
      });
  }


  editPatient(patient: Patient) {
    this.dialog.open(PatientFormComponent, {
      data: {
        ...patient, diagnosis: patient.diagnosis.id, ward: patient.ward.id
      }
    }).afterClosed()
      .subscribe(data => {
        if (data) {
          this.patientService.updatePatient(data)
            .subscribe(_ => {
                this.updatePatients(this.params);
                this.snackbarService.showInfoSnackbar('Patient successfully updated');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't update patient: ${error}`));
        }
      });
  }

  private updatePatients(params: PatientSearchParameters & PagingParameters) {
    this.patientService.getPatientsPage(params)
      .subscribe(page => {
        this.patients = page.content;
        this.paginator.length = page.totalElements;
      });
  }
}
