import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Diagnosis } from '../../doamain/Diagnosis';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { uniqueValidator } from '../CustomValidators';

@Component({
  selector: 'app-diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrls: ['./diagnosis-form.component.css']
})
export class DiagnosisFormComponent implements OnInit {
  @Input() _diagnoses: Diagnosis[];
  set diagnoses(diagnoses: Diagnosis[]) {
    this._diagnoses = diagnoses;
    this.name.setValidators([Validators.required, uniqueValidator(diagnoses)]);
  }

  get diagnoses() {
    return this._diagnoses;
  }

  form = this.fb.group({
    id: [''],
    name: ['']
  });
  type: 'add' | 'update';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Diagnosis
  ) { }

  ngOnInit(): void {
    this.form.patchValue(this.data);
    this.type = (this.data.id === undefined) ? 'add' : 'update';
  }

  get name() { return this.form.get('name'); }
}
