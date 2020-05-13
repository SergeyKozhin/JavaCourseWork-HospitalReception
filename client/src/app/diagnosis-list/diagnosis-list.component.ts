import { Component, OnInit } from '@angular/core';
import { Diagnosis } from '../doamain/Diagnosis';
import { DiagnosisService } from '../services/diagnosis.service';
import { MatDialog } from '@angular/material/dialog';
import { DiagnosisFormComponent } from '../forms/diagnosis-form/diagnosis-form.component';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {
  diagnoses: Diagnosis[];

  constructor(
    private diagnosisService: DiagnosisService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this.diagnosisService.getDiagnoses()
      .subscribe(diagnoses => this.diagnoses = diagnoses);
  }

  addDiagnosis() {
    const dialogRef = this.dialog.open(DiagnosisFormComponent, {
      data: {} as Diagnosis
    });
    dialogRef.componentInstance.diagnoses = this.diagnoses;
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.diagnosisService.addDiagnosis(data)
            .subscribe(newDiagnosis => {
              this.diagnoses.push(newDiagnosis);
            });
        }
      });
  }

  deleteDiagnosis(diagnosis: Diagnosis) {
    this.diagnosisService.deleteDiagnosis(diagnosis)
      .subscribe(_ => this.diagnoses = this.diagnoses.filter(el => el !== diagnosis));
  }

  updateDiagnosis(diagnosis: Diagnosis) {
    const dialogRef = this.dialog.open(DiagnosisFormComponent, {
      data: diagnosis
    });
    dialogRef.componentInstance.diagnoses = this.diagnoses.filter(el => el.id !== diagnosis.id);
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.diagnosisService.updateDiagnosis(data)
            .subscribe(_ => Object.assign(this.diagnoses.find(el => el.id === data.id), data));
        }
      });
  }
}
