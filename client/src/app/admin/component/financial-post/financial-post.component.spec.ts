import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPostComponent } from './financial-post.component';

describe('FinancialPostComponent', () => {
  let component: FinancialPostComponent;
  let fixture: ComponentFixture<FinancialPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
