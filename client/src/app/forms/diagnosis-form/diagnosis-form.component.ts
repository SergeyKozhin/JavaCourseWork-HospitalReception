import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Diagnosis } from '../../doamain/Diagnosis';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrls: ['./diagnosis-form.component.css']
})
export class DiagnosisFormComponent implements OnInit {
  form = this.fb.group({
    id: [''],
    name: ['', Validators.required]
  });
  type: 'add' | 'update';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Diagnosis | undefined
  ) { }

  ngOnInit(): void {
    this.form.patchValue(this.data);
    this.type = (this.data.id === undefined) ? 'add' : 'update';
  }

  get name() { return this.form.get('name'); }
}
