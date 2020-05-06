import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit{
  params$: Observable<PatientSearchParameters>;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.params$ = this.route.queryParams;
  }

}
