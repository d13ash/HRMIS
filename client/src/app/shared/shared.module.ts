import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ChartComponent } from './chart/chart.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { MainDashCardComponent } from './main-dash-card/main-dash-card.component';
import { OwlCarouselComponent } from './owl-carousel/owl-carousel.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { ResourceAllotmentComponent } from './resource-allotment/resource-allotment.component';


@NgModule({
  declarations: [
    ChartComponent,
    LeaveRequestComponent,
    MainDashCardComponent,
    OwlCarouselComponent,
    ProgressbarComponent,
    ResourceAllotmentComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
