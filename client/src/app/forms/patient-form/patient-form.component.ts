import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiagnosisService } from '../../services/diagnosis.service';
import { WardService } from '../../services/ward.service';
import { Diagnosis } from '../../doamain/Diagnosis';
import { Ward } from '../../doamain/Ward';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  form = this.fb.group({
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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(JSON.stringify(this.form.value));
    this.form.patchValue(this.data);

    this.type = (this.data.id === undefined) ? 'add' : 'update';

    this.diagnosisService.getDiagnoses()
      .subscribe(diagnoses => {
        this.diagnoses = diagnoses;

        if (this.data.diagnosis) {
          this.diagnosis.setValue(diagnoses.find(diagnosis => diagnosis.id === this.data.diagnosis));
        }
      });

    this.wardService.getWards()
      .subscribe(wards => {
        this.wards = wards;

        if (this.data.ward) {
          this.ward.setValue(wards.find(ward => ward.id === this.data.ward));
        }
      });
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
}
