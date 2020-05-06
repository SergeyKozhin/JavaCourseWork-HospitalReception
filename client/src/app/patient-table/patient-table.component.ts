import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Patient } from '../doamain/Patient';
import { PatientService } from '../services/patient.service';
import { PatientSearchParameters } from '../services/PatientSearchParameters';

@Component({
  selector: 'app-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css']
})
export class PatientTableComponent implements OnInit, OnChanges {
  @Input() params: PatientSearchParameters;
  displayedColumns: string[] = ['firstName', 'lastName', 'fatherName', 'diagnosis', 'ward'];
  patients: Patient[];

  constructor(
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.params) {
      this.patientService.getPatients(changes.params.currentValue)
        .subscribe(patients => this.patients = patients);
    }
  }
}
