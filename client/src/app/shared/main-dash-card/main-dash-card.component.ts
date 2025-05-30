import { Component,  OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-dash-card',
  templateUrl: './main-dash-card.component.html',
  styleUrls: ['./main-dash-card.component.scss']
})
export class MainDashCardComponent implements OnInit {
  countProjectData: any;
  projectCountValue: any;
  countWorkData: any;
  workCountValue: any;
  countEmpData: any;
  empCountValue: any;
  constructor(private ds: DataService) { }
  ngOnInit(): void {
    this.countProject()
    this.countWork()
    this.countEmp()
   
  }

  countProject() {
    this.ds.getData('dashboardContent/projectCount').subscribe((res) => {
      this.countProjectData = res
      this.projectCountValue = this.countProjectData[0].project_count;
    })
  }

  countWork() {
    this.ds.getData('dashboardContent/workCount').subscribe((res) => {
      this.countWorkData = res
      this.workCountValue = this.countWorkData[0].countdata;
    })
  }

  countEmp() {
    this.ds.getData('dashboardContent/empCount').subscribe((res) => {
      this.countEmpData = res
      this.empCountValue = this.countEmpData[0].empCount;
    })
  }

 
}