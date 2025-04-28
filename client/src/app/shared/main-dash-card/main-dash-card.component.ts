import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { AuthserviceService } from '../../services/authservice.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { DataService } from 'src/app/services/data.service';

// AuthService, DataService
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

  constructor(private ds :DataService, private as:AuthService,private http :HttpClient){}
  ngOnInit(): void {
  this.countProject()
  this.countWork()
  this.countEmp()
  }

countProject(){
  this.ds.getData('dashboardContent/projectCount').subscribe((res)=>{
    this.countProjectData = res
    console.log(this.countProjectData)
    this.projectCountValue = this.countProjectData[0].project_count;
    console.log(this.projectCountValue);    
  })
}

countWork(){
  this.ds.getData('dashboardContent/workCount').subscribe((res)=>{
    this.countWorkData = res
    console.log(this.countWorkData)
    this.workCountValue = this.countWorkData[0].countdata;
    console.log(this.workCountValue);    
  })
}

countEmp(){
  this.ds.getData('dashboardContent/empCount').subscribe((res)=>{
    this.countEmpData = res
    console.log(this.countProjectData)
    this.empCountValue = this.countEmpData[0].empCount;
    console.log(this.empCountValue);    
  })
}


}