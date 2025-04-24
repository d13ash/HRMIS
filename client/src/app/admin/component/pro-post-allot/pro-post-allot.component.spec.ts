import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPostAllotComponent } from './pro-post-allot.component';

describe('ProPostAllotComponent', () => {
  let component: ProPostAllotComponent;
  let fixture: ComponentFixture<ProPostAllotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProPostAllotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPostAllotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
