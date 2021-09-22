import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWorkspaceModalComponent } from './share-workspace-modal.component';

describe('ShareWorkspaceModalComponent', () => {
  let component: ShareWorkspaceModalComponent;
  let fixture: ComponentFixture<ShareWorkspaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareWorkspaceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWorkspaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
