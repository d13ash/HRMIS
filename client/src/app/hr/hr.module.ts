import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HRRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { CollectModule } from '../collect/collect.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HrDashboardComponent } from './component/hr-dashboard/hr-dashboard.component';
import { HrDashContentComponent } from './component/hr-dash-content/hr-dash-content.component';
import { AllEmployeeComponent } from './component/all-employee/all-employee.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { ProjectAssignComponent } from './component/project-assign/project-assign.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ProgressComponent } from './component/progress/progress.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HrComponent,
    HrDashboardComponent,
    HrDashContentComponent,
    AllEmployeeComponent,
    AddEmployeeComponent,
    ProjectAssignComponent,
    PostDetailComponent,
    ForgotPasswordComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HRRoutingModule,
    CollectModule,
    SharedModule
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})
export class HrModule { }
