import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdaypopUpComponent } from './birthdaypop-up.component';

describe('BirthdaypopUpComponent', () => {
  let component: BirthdaypopUpComponent;
  let fixture: ComponentFixture<BirthdaypopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BirthdaypopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdaypopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
