import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAllotmentComponent } from './work-allotment.component';

describe('WorkAllotmentComponent', () => {
  let component: WorkAllotmentComponent;
  let fixture: ComponentFixture<WorkAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
