import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { AllEmployeeComponent } from './component/all-employee/all-employee.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HrDashContentComponent } from './component/hr-dash-content/hr-dash-content.component';
import { HrDashboardComponent } from './component/hr-dashboard/hr-dashboard.component';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { ProgressComponent } from './component/progress/progress.component';


@NgModule({
  declarations: [
    HrComponent,
    AddEmployeeComponent,
    AllEmployeeComponent,
    ForgotPasswordComponent,
    HrDashContentComponent,
    HrDashboardComponent,
    PostDetailComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule
  ]
})
export class HrModule { }
