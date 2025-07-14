import { Component, OnInit, ViewChild } from '@angular/core';
import { BirthdaypopUpComponent } from '../../../shared/birthdaypop-up/birthdaypop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
// import { ProgressComponent } from 'src/app/hr/component/progress/progress.component';
@Component({
  selector: 'app-emp-dash-content',
  templateUrl: './emp-dash-content.component.html',
  styleUrls: ['./emp-dash-content.component.scss']
})
export class EmpDashContentComponent implements OnInit {

  constructor(private dialog: MatDialog, private ds: DataService){}

  ngOnInit(): void {
    this.openbirthdyPopup();
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