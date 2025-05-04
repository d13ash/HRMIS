import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAllotmentDashboardComponent } from './work-allotment-dashboard.component';

describe('WorkAllotmentDashboardComponent', () => {
  let component: WorkAllotmentDashboardComponent;
  let fixture: ComponentFixture<WorkAllotmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkAllotmentDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAllotmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
