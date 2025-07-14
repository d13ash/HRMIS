import { Component } from '@angular/core';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss'
})
export class ExportDialogComponent {
  selectedFormat: 'pdf' | 'excel' | 'csv' = 'pdf';
}
