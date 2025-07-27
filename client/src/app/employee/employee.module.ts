import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { CollectModule } from '../collect/collect.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpDashContentComponent } from './component/emp-dash-content/emp-dash-content.component';
import { EmpDashboardComponent } from './component/emp-dashboard/emp-dashboard.component';
import { MyWorkComponent } from './component/my-work/my-work.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EmployeeProfileComponent } from './component/employee-profile/employee-profile.component';
import { ProfileViewComponent } from './component/profile-view/profile-view.component';
import { SharedModule } from '../shared/shared.module';
import { EmpProjectComponent } from './component/emp-project/emp-project.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmpDashContentComponent,
    EmpDashboardComponent,
    MyWorkComponent,
    EmployeeProfileComponent,
    ProfileViewComponent,
    EmpProjectComponent,
 
  
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
    CollectModule,
    SharedModule
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class EmployeeModule { }
