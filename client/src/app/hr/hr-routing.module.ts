import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrComponent } from './hr.component';
import { HrDashContentComponent } from './component/hr-dash-content/hr-dash-content.component';
import { HrDashboardComponent } from './component/hr-dashboard/hr-dashboard.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { ProjectAssignComponent } from './component/project-assign/project-assign.component';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { AllEmployeeComponent } from './component/all-employee/all-employee.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { EmployeeProfileComponent } from '../employee/component/employee-profile/employee-profile.component';
import { ProfileViewComponent } from '../employee/component/profile-view/profile-view.component';
import { ProjectWorkComponent } from '../admin/component/project-work/project-work.component';
import { ProjectWorkDetailComponent } from '../admin/component/project-work-detail/project-work-detail.component';
import { WorkAllotmentComponent } from '../admin/component/work-allotment/work-allotment.component';
import { ProjectModuleComponent } from '../admin/component/project-module/project-module.component';
import { MapProjectModuleComponent } from '../admin/component/map-project-module/map-project-module.component';
import { ProgressComponent } from './component/progress/progress.component';
import { LeaveRequestComponent } from '../shared/leave-request/leave-request.component';

const routes: Routes =  [
  { path: '', redirectTo: 'hrdashboard/content', pathMatch: 'full' }, 
  
  { path: 'hrdashboard', component: HrDashboardComponent,
    children : [
      { path: 'content', component: HrDashContentComponent },
       { path: 'project-assign', component: ProjectAssignComponent },
       { path: 'add-emp', component: AddEmployeeComponent},
       { path: 'post-detail', component: PostDetailComponent},
       { path: 'all-employee', component: AllEmployeeComponent},
       { path: 'forgot-password', component: ForgotPasswordComponent},
       { path: 'profile-view', component: ProfileViewComponent},
       { path: 'profile-view/employee-profile', component: EmployeeProfileComponent},
       { path: 'project-work', component: ProjectWorkComponent },
       { path: 'project-work-detail', component: ProjectWorkDetailComponent },
       { path: 'work-allotment', component: WorkAllotmentComponent },
       { path: 'project-module', component: ProjectModuleComponent },
       { path: 'map-project-module', component: MapProjectModuleComponent },
       { path: 'progress', component: ProgressComponent},
       { path: 'leave-request',  component:LeaveRequestComponent}


       
  
  ]},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRRoutingModule { }
