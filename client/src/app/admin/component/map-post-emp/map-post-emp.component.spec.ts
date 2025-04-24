import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPostEmpComponent } from './map-post-emp.component';

describe('MapPostEmpComponent', () => {
  let component: MapPostEmpComponent;
  let fixture: ComponentFixture<MapPostEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapPostEmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPostEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
