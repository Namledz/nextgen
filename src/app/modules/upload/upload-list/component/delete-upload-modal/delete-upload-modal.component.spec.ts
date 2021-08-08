import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUploadModalComponent } from './delete-upload-modal.component';

describe('DeleteUploadModalComponent', () => {
  let component: DeleteUploadModalComponent;
  let fixture: ComponentFixture<DeleteUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUploadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
