import { Component, OnInit } from '@angular/core';
import { Patient } from '../Patient';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientService.getPatients()
      .subscribe(patients => {
        this.patients = patients;
      });
  }
}
