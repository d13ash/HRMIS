import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ChartComponent } from './chart/chart.component';
// import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { MainDashCardComponent } from './main-dash-card/main-dash-card.component';
import { OwlCarouselComponent } from './owl-carousel/owl-carousel.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { ResourceAllotmentComponent } from './resource-allotment/resource-allotment.component';
import { ResourceShowComponent } from './resource-show/resource-show.component';
import { CollectModule } from '../collect/collect.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkAllotmentDashboardComponent } from './work-allotment-dashboard/work-allotment-dashboard.component';
import { LeaveStatusComponent } from './leave-status/leave-status.component';
import { LeaveHrComponent } from './leave-hr/leave-hr.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { LeaveRequestCheckComponent } from './leave-request-check/leave-request-check.component';


@NgModule({
  declarations: [
    ChartComponent,
    MainDashCardComponent,
    OwlCarouselComponent,
    ProgressbarComponent,
    ResourceAllotmentComponent,
    ResourceShowComponent,
    WorkAllotmentDashboardComponent,
    LeaveStatusComponent,
    LeaveHrComponent,
    LeaveRequestComponent,
    LeaveRequestCheckComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    CollectModule,
    ReactiveFormsModule
  ],
  exports:[
    ProgressbarComponent,
    MainDashCardComponent,
    ChartComponent,
    OwlCarouselComponent,
    ResourceShowComponent,
    WorkAllotmentDashboardComponent,
    LeaveStatusComponent,
    LeaveHrComponent,
    LeaveRequestComponent,
    LeaveRequestCheckComponent,
  ]
})
export class SharedModule { }
