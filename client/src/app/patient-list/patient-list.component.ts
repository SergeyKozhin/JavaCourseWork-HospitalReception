import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientSearchParameters } from '../services/PatientSearchParameters';
import { Observable } from 'rxjs';
import { DiagnosisService } from '../services/diagnosis.service';
import { CheckboxItem } from '../checkbox-filter/CheckboxItem';
import { WardService } from '../services/ward.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  params$: Observable<PatientSearchParameters>;
  diagnosesItems: CheckboxItem[];
  wardsItems: CheckboxItem[];

  constructor(
    private diagnosisService: DiagnosisService,
    private wardService: WardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.params$ = this.route.queryParams;
    this.diagnosisService.getDiagnoses()
      .subscribe(diagnoses => {
        this.diagnosesItems = diagnoses.map(diagnosis => {
          return {
            value: diagnosis.id.toString(),
            label: diagnosis.name
          };
        });

        this.params$
          .subscribe(params => {
            if (params.diagnosis) {
              this.diagnosesItems = this.diagnosesItems.map(item => ({
                ...item,
                checked: params.diagnosis.includes(item.value)
              }));
            }
          })
        ;
      });

    this.wardService.getWards()
      .subscribe(wards => {
        this.wardsItems = wards.map(ward => {
          return {
            value: ward.id.toString(),
            label: ward.name
          };
        });

        this.params$
          .subscribe(params => {
            if (params.ward) {
              this.wardsItems = this.wardsItems.map(item => ({
                ...item,
                checked: params.ward.includes(item.value)
              }));
            }
          });
      });
  }

  onFilterChange(field: 'diagnoses' | 'wards', selected: string[]) {
    this.params$
      .subscribe(params => {
        let newParams: PatientSearchParameters;
        if (field === 'diagnoses') {
          newParams = { ...params, diagnosis: selected };
        } else {
          newParams = { ...params, ward: selected };
        }
        this.router.navigate(['/patients'], { queryParams: newParams }).finally();
      });
  }

  onSearch(name: string) {
    this.params$
      .subscribe(params => {
        let newParams: PatientSearchParameters;
        if (name) {
          newParams = { ...params, name };
        } else {
          newParams = { ...params, name: null };
        }
        this.router.navigate(['/patients'], { queryParams: newParams }).finally();
      });
  }
}
