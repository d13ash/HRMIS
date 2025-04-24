import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { EmpDashContentComponent } from './component/emp-dash-content/emp-dash-content.component';
import { EmpDashboardComponent } from './component/emp-dashboard/emp-dashboard.component';
import { EmployeeProfileComponent } from './component/employee-profile/employee-profile.component';
import { MyWorkComponent } from './component/my-work/my-work.component';
import { ProfileViewComponent } from './component/profile-view/profile-view.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmpDashContentComponent,
    EmpDashboardComponent,
    EmployeeProfileComponent,
    MyWorkComponent,
    ProfileViewComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
