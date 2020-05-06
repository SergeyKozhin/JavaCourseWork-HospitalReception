import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientSearchParameters } from '../services/PatientSearchParameters';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit{
  params: PatientSearchParameters;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => this.params = params);
  }

}
