import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashContentComponent } from './admin-dash-content.component';

describe('AdminDashContentComponent', () => {
  let component: AdminDashContentComponent;
  let fixture: ComponentFixture<AdminDashContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
