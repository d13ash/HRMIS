import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashCardComponent } from './main-dash-card.component';

describe('MainDashCardComponent', () => {
  let component: MainDashCardComponent;
  let fixture: ComponentFixture<MainDashCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainDashCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDashCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
