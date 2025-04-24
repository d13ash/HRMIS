import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDashContentComponent } from './emp-dash-content.component';

describe('EmpDashContentComponent', () => {
  let component: EmpDashContentComponent;
  let fixture: ComponentFixture<EmpDashContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpDashContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpDashContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
