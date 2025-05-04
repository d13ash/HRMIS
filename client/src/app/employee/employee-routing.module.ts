import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { EmpDashboardComponent } from './component/emp-dashboard/emp-dashboard.component';
import { EmpDashContentComponent } from './component/emp-dash-content/emp-dash-content.component';
import { MyWorkComponent } from './component/my-work/my-work.component';
import { EmployeeProfileComponent } from './component/employee-profile/employee-profile.component';
import { ProfileViewComponent } from './component/profile-view/profile-view.component';
import { ResourceShowComponent } from '../shared/resource-show/resource-show.component';

const routes: Routes =[
  { path: '', redirectTo: 'employee-dash/content', pathMatch: 'full' }, 
  
  { path: 'employee-dash', component: EmpDashboardComponent,
    children : [
      { path: 'content', component: EmpDashContentComponent },
      { path: 'my-work', component: MyWorkComponent },
      { path: 'profile-view', component: ProfileViewComponent},
      { path: 'profile-view/employee-profile', component: EmployeeProfileComponent},
      { path: 'my-resource',component: ResourceShowComponent}

      
  
  
  ]},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
