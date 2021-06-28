import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesIndexComponent } from './workspaces-index.component';

describe('WorkspacesIndexComponent', () => {
  let component: WorkspacesIndexComponent;
  let fixture: ComponentFixture<WorkspacesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacesIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
