import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-logout-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>Are you sure you want to log out?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmLogoutDialogComponent {}

