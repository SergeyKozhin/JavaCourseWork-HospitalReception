import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../Patient';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[];

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientService.getPatients()
      .subscribe(patients => this.patients = patients);
  }

}
