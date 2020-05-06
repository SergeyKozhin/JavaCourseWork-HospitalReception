import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../doamain/Patient';
import { PatientService } from '../services/patient.service';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  @Input() params$: Observable<PatientSearchParameters>;
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.params$
      .subscribe(params =>
        this.patientService.getPatients(params)
          .subscribe(patients => this.patients = patients)
      );
  }
}
