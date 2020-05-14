import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Diagnosis } from '../doamain/Diagnosis';
import { DiagnosisService } from '../services/diagnosis.service';
import { MatDialog } from '@angular/material/dialog';
import { DiagnosisFormComponent } from '../forms/diagnosis-form/diagnosis-form.component';
import { SnackbarService } from '../services/snackbar.service';
import { ConfirmationWindowComponent } from '../forms/confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {
  @ViewChild('list') listDiv: ElementRef;
  diagnoses: Diagnosis[];

  constructor(
    private diagnosisService: DiagnosisService,
    private snackbarService: SnackbarService,
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
                this.snackbarService.showInfoSnackbar('Diagnosis successfully added.');
                this.diagnoses.push(newDiagnosis);
                requestAnimationFrame(() =>
                  this.listDiv.nativeElement.scrollTop = this.listDiv.nativeElement.scrollHeight
                );
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't add diagnosis: ${error}`));
        }
      });
  }

  deleteDiagnosis(diagnosis: Diagnosis) {
    const dialogRef = this.dialog.open(ConfirmationWindowComponent, {
      data: `Are you sure you want to delete diagnosis ${diagnosis.name}?`
    });
    dialogRef.afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.diagnosisService.deleteDiagnosis(diagnosis)
            .subscribe(
              _ => {
                this.diagnoses = this.diagnoses.filter(el => el !== diagnosis);
                this.snackbarService.showInfoSnackbar('Diagnosis successfully deleted');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't delete diagnosis: ${error}`));
        }
      });
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
            .subscribe(
              _ => {
                Object.assign(this.diagnoses.find(el => el.id === data.id), data);
                this.snackbarService.showInfoSnackbar('Diagnosis successfully updated');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't update diagnosis: ${error}`));
        }
      });
  }
}
