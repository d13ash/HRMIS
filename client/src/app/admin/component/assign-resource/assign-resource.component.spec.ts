import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignResourceComponent } from './assign-resource.component';

describe('AssignResourceComponent', () => {
  let component: AssignResourceComponent;
  let fixture: ComponentFixture<AssignResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
