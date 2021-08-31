import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkspaceModalComponent } from './edit-workspace-modal.component';

describe('EditWorkspaceModalComponent', () => {
  let component: EditWorkspaceModalComponent;
  let fixture: ComponentFixture<EditWorkspaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkspaceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkspaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
