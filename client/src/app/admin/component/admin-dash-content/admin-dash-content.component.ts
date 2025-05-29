import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderComponent } from '../reminder/reminder.component';

// DataService
@Component({
  selector: 'app-admin-dash-content',
  templateUrl: './admin-dash-content.component.html',
  styleUrls: ['./admin-dash-content.component.scss']
})
export class AdminDashContentComponent implements OnInit {

  mapData: any[] = [];

  constructor(private ds: DataService, private datepipe: DatePipe, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.openRelievingPopup();
  }

  openRelievingPopup() {

    this.ds.getData('dashboardContent/postMap').subscribe((result: any) => {
      // console.log(result);

      this.dialog.open(ReminderComponent, {
        width: '500px',
        data: result
      });
    })
  }

}