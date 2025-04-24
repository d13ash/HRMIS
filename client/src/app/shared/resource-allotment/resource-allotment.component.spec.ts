import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAllotmentComponent } from './resource-allotment.component';

describe('ResourceAllotmentComponent', () => {
  let component: ResourceAllotmentComponent;
  let fixture: ComponentFixture<ResourceAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
