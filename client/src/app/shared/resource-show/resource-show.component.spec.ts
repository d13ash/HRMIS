import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceShowComponent } from './resource-show.component';

describe('ResourceShowComponent', () => {
  let component: ResourceShowComponent;
  let fixture: ComponentFixture<ResourceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
