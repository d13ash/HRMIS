import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkDetailComponent } from './project-work-detail.component';

describe('ProjectWorkDetailComponent', () => {
  let component: ProjectWorkDetailComponent;
  let fixture: ComponentFixture<ProjectWorkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectWorkDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectWorkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
