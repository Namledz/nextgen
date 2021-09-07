import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWorkspaceModalComponent } from './delete-workspace-modal.component';

describe('DeleteWorkspaceModalComponent', () => {
  let component: DeleteWorkspaceModalComponent;
  let fixture: ComponentFixture<DeleteWorkspaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWorkspaceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWorkspaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
