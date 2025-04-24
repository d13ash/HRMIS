import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaYearDialogComponent } from './fina-year-dialog.component';

describe('FinaYearDialogComponent', () => {
  let component: FinaYearDialogComponent;
  let fixture: ComponentFixture<FinaYearDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinaYearDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinaYearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
