import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DiagnosisService } from '../../services/diagnosis.service';
import { WardService } from '../../services/ward.service';
import { Diagnosis } from '../../doamain/Diagnosis';
import { Ward } from '../../doamain/Ward';
import { DiagnosisFormComponent } from '../diagnosis-form/diagnosis-form.component';
import { SnackbarService } from '../../services/snackbar.service';
import { WardFormComponent } from '../ward-form/ward-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  form = this.fb.group({
    id: [''],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    fatherName: [''],
    diagnosis: ['', [Validators.required]],
    ward: ['', [Validators.required]]
  });
  type: 'add' | 'update';

  diagnoses: Diagnosis[];
  wards: Ward[];

  constructor(
    private fb: FormBuilder,
    private diagnosisService: DiagnosisService,
    private wardService: WardService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form.patchValue(this.data);

    this.type = (this.data.id === undefined) ? 'add' : 'update';

    this.diagnosisService.getDiagnoses({} as any)
      .subscribe(diagnoses => {
        this.diagnoses = diagnoses;

        if (this.data.diagnosis) {
          this.diagnosis.setValue(diagnoses.find(diagnosis => diagnosis.id === this.data.diagnosis));
        }
      });

    this.wardService.getWards({} as any)
      .subscribe(wards => {
        this.wards = wards;

        if (this.data.ward) {
          const wardFromServer = wards.find(ward => ward.id === this.data.ward);
          if (!this.wardUnavailable(wardFromServer)) {
            this.ward.setValue(wards.find(ward => ward.id === this.data.ward));
          }
        }
      });
  }

  wardUnavailable(ward: Ward) {
    const full = ward.patientCount === ward.maxCount;
    if (this.type === 'add') {
      return full;
    } else {
      return full && this.data.ward !== ward.id;
    }
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get fatherName() {
    return this.form.get('fatherName');
  }

  get diagnosis() {
    return this.form.get('diagnosis');
  }

  get ward() {
    return this.form.get('ward');
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
                this.diagnosis.setValue(newDiagnosis);
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't add diagnosis: ${error}`));
        }
      });
  }

  addWard() {
    const dialogRef = this.dialog.open(WardFormComponent, {
      data: {} as Ward
    });
    dialogRef.componentInstance.wards = this.wards;
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.wardService.addWard(data)
            .subscribe(newWard => {
                this.snackbarService.showInfoSnackbar('Ward successfully added.');
                this.wards.push(newWard);
                this.wards = this.wards.sort((a, b) => a.name.localeCompare(b.name));
                this.ward.setValue(newWard);
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't add ward: ${error}`));
        }
      });
  }
}
