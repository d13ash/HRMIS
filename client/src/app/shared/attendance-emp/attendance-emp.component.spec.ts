import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceEmpComponent } from './attendance-emp.component';

describe('AttendanceEmpComponent', () => {
  let component: AttendanceEmpComponent;
  let fixture: ComponentFixture<AttendanceEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceEmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
