import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Diagnosis } from '../../doamain/Diagnosis';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { uniqueValidator } from '../CustomValidators';
import { Ward } from '../../doamain/Ward';

@Component({
  selector: 'app-ward-form',
  templateUrl: './ward-form.component.html',
  styleUrls: ['./ward-form.component.css']
})
export class WardFormComponent implements OnInit {
  @Input() _wards: Diagnosis[];
  set wards(wards: Diagnosis[]) {
    this._wards = wards;
    this.name.setValidators([Validators.required, uniqueValidator(wards)]);
  }

  get wards() {
    return this._wards;
  }

  form = this.fb.group({
    id: [''],
    name: [''],
    maxCount: ['']
  });
  type: 'add' | 'update';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Ward
  ) { }

  ngOnInit(): void {
    this.form.patchValue(this.data);
    this.type = (this.data.id === undefined) ? 'add' : 'update';
    this.maxCount.setValidators([Validators.required, Validators.min(this.type === 'add' ? 1 : this.data.patientCount)]);
  }

  get name() { return this.form.get('name'); }

  get maxCount() { return this.form.get('maxCount'); }
}
