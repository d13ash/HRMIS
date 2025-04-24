import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialBudgetComponent } from './financial-budget.component';

describe('FinancialBudgetComponent', () => {
  let component: FinancialBudgetComponent;
  let fixture: ComponentFixture<FinancialBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
