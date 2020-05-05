import { Component, OnInit } from '@angular/core';
import { Patient } from '../Patient';
import { PatientService } from '../patient.service';
import { PatientSearchParameters } from '../PatientSearchParameters';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  params: PatientSearchParameters;
  patients: Patient[];

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.params = params;

        this.patientService.getPatients(params)
          .subscribe(patients => {
            this.patients = patients;
          });
      });
  }
}
