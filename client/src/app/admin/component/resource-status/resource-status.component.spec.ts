import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceStatusComponent } from './resource-status.component';

describe('ResourceStatusComponent', () => {
  let component: ResourceStatusComponent;
  let fixture: ComponentFixture<ResourceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
