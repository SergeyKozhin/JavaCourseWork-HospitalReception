import { Component, OnInit } from '@angular/core';
import { Diagnosis } from '../doamain/Diagnosis';
import { DiagnosisService } from '../services/diagnosis.service';
import { MatDialog } from '@angular/material/dialog';
import { DiagnosisFormComponent } from '../forms/diagnosis-form/diagnosis-form.component';
import { SnackbarService } from '../services/snackbar.service';
import { ConfirmationWindowComponent } from '../forms/confirmation-window/confirmation-window.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit {
  search: string;
  diagnoses: Diagnosis[];

  constructor(
    private diagnosisService: DiagnosisService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.search = params.name;
        this.diagnosisService.getDiagnoses(params as any)
          .subscribe(diagnoses => this.diagnoses = diagnoses);
      });
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
                this.diagnoses = this.diagnoses.sort((a, b) => a.name.localeCompare(b.name));
                requestAnimationFrame(() => {
                  const item = document.getElementById(newDiagnosis.id.toString());
                  item.scrollIntoView(true);
                });
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

  onSearch() {
    const newParams = { name: (this.search) ? this.search : null };
    this.router.navigate(['/diagnoses'], { queryParams: newParams }).finally();
  }
}
