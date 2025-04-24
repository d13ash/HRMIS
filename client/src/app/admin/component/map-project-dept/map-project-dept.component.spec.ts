import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProjectDeptComponent } from './map-project-dept.component';

describe('MapProjectDeptComponent', () => {
  let component: MapProjectDeptComponent;
  let fixture: ComponentFixture<MapProjectDeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapProjectDeptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapProjectDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
