import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockItemDetailsComponent } from './stock-item-details.component';

describe('StockItemDetailsComponent', () => {
  let component: StockItemDetailsComponent;
  let fixture: ComponentFixture<StockItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockItemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
