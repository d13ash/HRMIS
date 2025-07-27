import { Component, OnInit, ViewChild } from '@angular/core';
import { BirthdaypopUpComponent } from '../../../shared/birthdaypop-up/birthdaypop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emp-dash-content',
  templateUrl: './emp-dash-content.component.html',
  styleUrls: ['./emp-dash-content.component.scss']
})
export class EmpDashContentComponent implements OnInit {

  constructor(private dialog: MatDialog, private ds: DataService){}

  ngOnInit(): void {
    this.openbirthdayPopup();
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

  // Manual method to open birthday popup (ignoring localStorage restrictions)
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