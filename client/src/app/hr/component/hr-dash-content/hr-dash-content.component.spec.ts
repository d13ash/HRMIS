import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDashContentComponent } from './hr-dash-content.component';

describe('HrDashContentComponent', () => {
  let component: HrDashContentComponent;
  let fixture: ComponentFixture<HrDashContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HrDashContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrDashContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
