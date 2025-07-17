import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderComponent } from '../reminder/reminder.component';
import { BirthdaypopUpComponent } from '../../../shared/birthdaypop-up/birthdaypop-up.component';
import Swal from 'sweetalert2';

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
    this.openbirthdayPopup();
  }

  openRelievingPopup() {
    // Check if popup was already shown today
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('relievingPopupLastShown');
    
    if (lastShown === today) {
      return; // Don't show popup if already shown today
    }

    this.ds.getData('dashboardContent/postMap').subscribe((result: any) => {
      if (result && result.length > 0) {
        const dialogRef = this.dialog.open(ReminderComponent, {
          width: '500px',
          data: result
        });

        // Mark as shown today when dialog opens
        localStorage.setItem('relievingPopupLastShown', today);
      }
    });
  }

  openbirthdayPopup() {
    // Check if popup was already shown today
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('birthdayPopupLastShown');
    
    if (lastShown === today) {
      return; // Don't show popup if already shown today
    }

    this.ds.getData('birthdaypop/birthday-soon').subscribe((result: any) => {
      console.log(result);
      
      if (result && result.length > 0) {
        const dialogRef = this.dialog.open(BirthdaypopUpComponent, {
          width: '500px',
          data: result
        });

        // Mark as shown today when dialog opens
        localStorage.setItem('birthdayPopupLastShown', today);
      }
    });
  }

  // Manual methods to open popups (ignoring localStorage restrictions)
  openRelievingPopupManually() {
    this.ds.getData('dashboardContent/postMap').subscribe((result: any) => {
      if (result && result.length > 0) {
        this.dialog.open(ReminderComponent, {
          width: '500px',
          data: result
        });
      } else {
        Swal.fire({
          title: 'No Data Found',
          text: 'No relieving employees found.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  openBirthdayPopupManually() {
    this.ds.getData('birthdaypop/birthday-soon').subscribe((result: any) => {
      if (result && result.length > 0) {
        this.dialog.open(BirthdaypopUpComponent, {
          width: '500px',
          data: result
        });
      } else {
        Swal.fire({
          title: 'No Data Found',
          text: 'No upcoming birthdays found.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}