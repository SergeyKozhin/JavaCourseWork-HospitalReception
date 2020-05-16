import { Component, OnInit } from '@angular/core';
import { WardService } from '../services/ward.service';
import { Ward } from '../doamain/Ward';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationWindowComponent } from '../forms/confirmation-window/confirmation-window.component';
import { WardFormComponent } from '../forms/ward-form/ward-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.css']
})
export class WardListComponent implements OnInit {
  search: string;
  wards: Ward[];

  constructor(
    private wardService: WardService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.search = params.name;
        this.wardService.getWards(params as any)
          .subscribe(wards => this.wards = wards);
      });
  }

  addWard() {
    const dialogRef = this.dialog.open(WardFormComponent, {
      data: {} as Ward
    });
    dialogRef.componentInstance.wards = this.wards;
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.wardService.addWard(data)
            .subscribe(newWard => {
                this.snackbarService.showInfoSnackbar('Ward successfully added.');
                this.wards.push(newWard);
                this.wards = this.wards.sort((a, b) => a.name.localeCompare(b.name));
                requestAnimationFrame(() => {
                  const item = document.getElementById(newWard.id.toString());
                  item.scrollIntoView(true);
                });
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't add ward: ${error}`));
        }
      });
  }

  deleteWard(ward: Ward) {
    const dialogRef = this.dialog.open(ConfirmationWindowComponent, {
      data: `Are you sure you want to delete ${ward.name} ward?`
    });
    dialogRef.afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.wardService.deleteWard(ward)
            .subscribe(
              _ => {
                this.wards = this.wards.filter(el => el !== ward);
                this.snackbarService.showInfoSnackbar('Ward successfully deleted');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't delete ward: ${error}`));
        }
      });
  }

  updateWard(ward: Ward) {
    const dialogRef = this.dialog.open(WardFormComponent, {
      data: ward
    });
    dialogRef.componentInstance.wards = this.wards.filter(el => el.id !== ward.id);
    dialogRef.afterClosed()
      .subscribe(data => {
        if (data) {
          this.wardService.updateWard(data)
            .subscribe(
              _ => {
                Object.assign(this.wards.find(el => el.id === data.id), data);
                this.snackbarService.showInfoSnackbar('Ward successfully updated');
              },
              error => this.snackbarService.showErrorSnackbar(`Couldn't update ward: ${error}`));
        }
      });
  }

  onSearch() {
    const newParams = { name: (this.search) ? this.search : null };
    this.router.navigate(['/wards'], { queryParams: newParams }).finally();
  }
}
