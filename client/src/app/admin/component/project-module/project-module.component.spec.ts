import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectModuleComponent } from './project-module.component';

describe('ProjectModuleComponent', () => {
  let component: ProjectModuleComponent;
  let fixture: ComponentFixture<ProjectModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
