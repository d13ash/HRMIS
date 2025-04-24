import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProjectModuleComponent } from './map-project-module.component';

describe('MapProjectModuleComponent', () => {
  let component: MapProjectModuleComponent;
  let fixture: ComponentFixture<MapProjectModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapProjectModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapProjectModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
