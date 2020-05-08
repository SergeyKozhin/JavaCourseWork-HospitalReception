import {Component, OnInit,} from '@angular/core';
import {Diagnosis} from '../doamain/Diagnosis';
import {DiagnosisService} from '../services/diagnosis.service';
import {MatDialog} from '@angular/material/dialog';
import {DiagnosisFormComponent} from '../forms/diagnosis-form/diagnosis-form.component';
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {
  diagnoses: Diagnosis[];
  patientCount? = new Map<number, number>();

  constructor(
    private diagnosisService: DiagnosisService,
    private patientService: PatientService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this.diagnosisService.getDiagnoses()
      .subscribe(diagnoses => {
        this.diagnoses = diagnoses

        this.patientService.getPatients({})
          .subscribe(patients => {
            for (const diagnosis of diagnoses) {
              this.patientCount.set(diagnosis.id, patients.filter(patient => patient.diagnosis.id == diagnosis.id).length);
            }
          })
      });
  }

  addDiagnosis() {
    const dialogRef = this.dialog.open(DiagnosisFormComponent, {
      data: {} as Diagnosis
    });
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.diagnosisService.addDiagnosis(data)
            .subscribe(newDiagnosis => {
              this.diagnoses.push(newDiagnosis);
              this.patientCount.set(newDiagnosis.id, 0);
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
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.diagnosisService.updateDiagnosis(data)
            .subscribe(_ => Object.assign(this.diagnoses.find(el => el.id === data.id), data));
        }
      });
  }
}
