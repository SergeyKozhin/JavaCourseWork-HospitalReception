import { Component, OnInit } from '@angular/core';
import { WardService } from '../ward.service';
import { Ward } from '../Ward';

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

}
