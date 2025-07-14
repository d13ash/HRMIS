import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { AdminDashContentComponent } from './component/admin-dash-content/admin-dash-content.component';
import { AddProjectComponent } from './component/add-project/add-project.component';
import { AddDeptComponent } from './component/add-dept/add-dept.component';
import { MapProjectDeptComponent } from './component/map-project-dept/map-project-dept.component';
import { AddResourceComponent } from './component/add-resource/add-resource.component';
import { AssignResourceComponent } from './component/assign-resource/assign-resource.component';
import { ResourceStatusComponent } from './component/resource-status/resource-status.component';
import { ProPostAllotComponent } from './component/pro-post-allot/pro-post-allot.component';
import { MapPostEmpComponent } from './component/map-post-emp/map-post-emp.component';
import { ProjectWorkComponent } from './component/project-work/project-work.component';
import { ProjectWorkDetailComponent } from './component/project-work-detail/project-work-detail.component';
import { WorkAllotmentComponent } from './component/work-allotment/work-allotment.component';
import { ProjectModuleComponent } from './component/project-module/project-module.component';
import { MapProjectModuleComponent } from './component/map-project-module/map-project-module.component';
import { FinancialYearPosComponent } from './component/financial-year-pos/financial-year-pos.component';
import { FinancialPostComponent } from './component/financial-post/financial-post.component';
import { FinancialBudgetComponent } from './component/financial-budget/financial-budget.component';
import { FinancialBudgetAllotmentComponent } from './component/financial-budget-allotment/financial-budget-allotment.component';
import { StockItemDetailsComponent } from './component/stock-item-details/stock-item-details.component';
import { ResourceAllotmentComponent } from '../shared/resource-allotment/resource-allotment.component';
// import { LeaveRequestComponent } from '../shared/leave-request/leave-request.component';
import { ProfileViewComponent } from '../employee/component/profile-view/profile-view.component';
import { EmployeeProfileComponent } from '../employee/component/employee-profile/employee-profile.component';
import { CategorySubcategoryComponent } from './component/category-subcategory/category-subcategory.component';
import { ResourceShowComponent } from '../shared/resource-show/resource-show.component';
import { ContactFromComponent } from './component/contact-from/contact-from.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { PostDetailComponent } from './component/post-detail/post-detail.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { LeaveRequestCheckComponent } from '../shared/leave-request-check/leave-request-check.component';
import { AttendanceComponent } from '../shared/attendance/attendance.component';

const routes: Routes = [
  { path: '', redirectTo: 'admindashboard/content', pathMatch: 'full' },

  {
    path: 'admindashboard',
    component: AdminDashboardComponent,
    children: [
      { path: 'content', component: AdminDashContentComponent },
      { path: 'add-project', component: AddProjectComponent },
      { path: 'add-dept', component: AddDeptComponent },
      { path: 'map-project-dept', component: MapProjectDeptComponent },
      { path: 'add-resource', component: AddResourceComponent },
      { path: 'assign-resource', component: AssignResourceComponent },
      { path: 'resource-status', component: ResourceStatusComponent },
      { path: 'pro-post-allot', component: ProPostAllotComponent },
      { path: 'map-post-emp', component: MapPostEmpComponent },
      { path: 'project-work', component: ProjectWorkComponent },
      { path: 'project-work-detail', component: ProjectWorkDetailComponent },
      { path: 'work-allotment', component: WorkAllotmentComponent },
      { path: 'project-module', component: ProjectModuleComponent },
      { path: 'map-project-module', component: MapProjectModuleComponent },
      { path: 'financial-year-pos', component: FinancialYearPosComponent },
      { path: 'financial-post', component: FinancialPostComponent },
      { path: 'financial-budget', component: FinancialBudgetComponent },
      {
        path: 'financial-budget-allotment',
        component: FinancialBudgetAllotmentComponent,
      },
      { path: 'stock-item-details', component: StockItemDetailsComponent },
      { path: 'resource-allotment', component: ResourceAllotmentComponent },
      { path: 'profile-view', component: ProfileViewComponent },
      {
        path: 'profile-view/employee-profile',
        component: EmployeeProfileComponent,
      },
      { path: 'R-category', component: CategorySubcategoryComponent },
      { path: 'my-resource', component: ResourceShowComponent },
      { path: 'contact-from', component: ContactFromComponent },
      { path: 'add-emp', component: AddEmployeeComponent },
      { path: 'post-detail', component: PostDetailComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'leave-request-check', component: LeaveRequestCheckComponent },
      { path: 'attendance', component: AttendanceComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
