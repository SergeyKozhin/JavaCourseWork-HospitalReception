import { Component, OnInit } from '@angular/core';
import { Diagnosis } from '../Diagnosis';
import { DiagnosisService } from '../diagnosis.service';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {
  diagnoses: Diagnosis[];

  constructor(
    private diagnosisService: DiagnosisService
  ) { }

  ngOnInit(): void {
    this.diagnosisService.getDiagnoses()
      .subscribe(diagnoses => this.diagnoses = diagnoses);
  }

}
