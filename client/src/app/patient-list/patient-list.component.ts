import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { Observable } from 'rxjs';
import { DiagnosisService } from '../services/diagnosis.service';
import { CheckboxItem } from '../checkbox-filter/CheckboxItem';
import { WardService } from '../services/ward.service';
import { PagingParameters } from '../services/PagingParameters';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  search: string;
  params$: Observable<PatientSearchParameters & PagingParameters>;
  params: PatientSearchParameters & PagingParameters;
  diagnosesItems$: Observable<CheckboxItem[]>;
  wardsItems$: Observable<CheckboxItem[]>;

  constructor(
    private diagnosisService: DiagnosisService,
    private wardService: WardService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.params$ = this.route.queryParams;

    this.params$
      .subscribe(params => {
        this.params = params;
        if (params.name) {
          this.search = params.name;
        }
      });

    this.diagnosisService.getDiagnoses({}as any)
      .subscribe(diagnoses => {
        const diagnosesItems = diagnoses.map(diagnosis => ({
          value: diagnosis.id.toString(),
          label: diagnosis.name
        }));


        this.diagnosesItems$ = this.params$
          .pipe(
            map(params =>
              diagnosesItems.map(item => ({
                ...item,
                checked: params.diagnosis?.includes(item.value)
              }))
            )
          );
      });

    this.wardService.getWards({} as any)
      .subscribe(wards => {
        const wardsItems = wards.map(ward => {
          return {
            value: ward.id.toString(),
            label: ward.name
          };
        });

        this.wardsItems$ = this.params$
          .pipe(
            map(params => {
              return wardsItems.map(item => ({
                ...item,
                checked: params.ward?.includes(item.value)
              }));
            })
          );
      });
  }

  onFilterChange(field: 'diagnoses' | 'wards', selected: string[]) {
    let newParams: PatientSearchParameters;
    if (field === 'diagnoses') {
      newParams = { ...this.params, diagnosis: selected };
    } else {
      newParams = { ...this.params, ward: selected };
    }
    this.router.navigate(['/patients'], { queryParams: newParams }).finally();
  }

  onSearch() {
    const newParams = { ...this.params, name: (this.search) ? this.search : null };
    this.router.navigate(['/patients'], { queryParams: newParams }).finally();
  }

  onParamsChange(params: PatientSearchParameters & PagingParameters) {
    this.router.navigate(['/patients'], { queryParams: params }).finally();
  }
}
