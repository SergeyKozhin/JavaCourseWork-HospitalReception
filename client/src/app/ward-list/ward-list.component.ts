import { Component, OnInit } from '@angular/core';
import { WardService } from '../services/ward.service';
import { Ward } from '../doamain/Ward';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.css']
})
export class WardListComponent implements OnInit {
  wards: Ward[];

  constructor(
    private wardService: WardService
  ) { }

  ngOnInit(): void {
    this.wardService.getWards()
      .subscribe(wards => this.wards = wards);

  }

  toObservable<T>(object: T): Observable<T> {
    return of(object);
  }

}
