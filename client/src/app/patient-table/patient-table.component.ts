import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../doamain/Patient';
import { PatientService } from '../services/patient.service';
import { PatientSearchParameters } from '../services/PatientSearchParameters';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];
  @Input('params')
  set params(params: PatientSearchParameters) {
    this.patientService.getPatients(params)
      .subscribe(patients => this.patients = patients);
  }

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
  }
}
