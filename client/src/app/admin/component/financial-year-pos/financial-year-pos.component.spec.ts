import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialYearPosComponent } from './financial-year-pos.component';

describe('FinancialYearPosComponent', () => {
  let component: FinancialYearPosComponent;
  let fixture: ComponentFixture<FinancialYearPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialYearPosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialYearPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
