import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialBudgetAllotmentComponent } from './financial-budget-allotment.component';

describe('FinancialBudgetAllotmentComponent', () => {
  let component: FinancialBudgetAllotmentComponent;
  let fixture: ComponentFixture<FinancialBudgetAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialBudgetAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialBudgetAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
