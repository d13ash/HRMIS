import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderComponent } from '../reminder/reminder.component';
import { BirthdaypopUpComponent } from '../../../shared/birthdaypop-up/birthdaypop-up.component';

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
    this.openbirthdyPopup();
  }

  openRelievingPopup() {

    this.ds.getData('dashboardContent/postMap').subscribe((result: any) => {
        this.dialog.open(ReminderComponent, {
        width: '500px',
        data: result
      });
    })
  }

  openbirthdyPopup() {
    this.ds.getData('birthdaypop/birthday-soon').subscribe((result: any) => {
      console.log(result);
      
      this.dialog.open(BirthdaypopUpComponent, {
        width: '500px',
        data: result
      });
    })
  }

}