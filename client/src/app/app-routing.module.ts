import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartpageComponent } from './components/startpage/startpage.component';
import { HomeComponent } from './components/home/home.component';
// import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './guard/admin.guard';
import { HrGuard } from './guard/hr.guard';
import { EmployeeGuard } from './guard/employee.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', component: StartpageComponent,
    children: [
      { path: 'home', component: HomeComponent
      },
]},

  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate:[AdminGuard] },
  { path: 'hr', loadChildren: () => import('./hr/hr.module').then(m => m.HrModule),canActivate:[HrGuard] },
  { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),canActivate:[EmployeeGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
