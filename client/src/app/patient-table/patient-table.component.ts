import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../Patient';
import { PatientService } from '../patient.service';
import { PatientSearchParameters } from '../PatientSearchParameters';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  @Input() params: PatientSearchParameters;
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientService.getPatients(this.params)
      .subscribe(patients => {
        this.patients = patients;
      });
  }
}
