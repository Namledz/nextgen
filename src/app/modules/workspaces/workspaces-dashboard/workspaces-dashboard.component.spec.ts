import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesDashboardComponent } from './workspaces-dashboard.component';

describe('WorkspacesDashboardComponent', () => {
  let component: WorkspacesDashboardComponent;
  let fixture: ComponentFixture<WorkspacesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
