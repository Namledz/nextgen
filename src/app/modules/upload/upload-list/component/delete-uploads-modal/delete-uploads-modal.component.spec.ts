import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUploadsModalComponent } from './delete-uploads-modal.component';

describe('DeleteUploadsModalComponent', () => {
  let component: DeleteUploadsModalComponent;
  let fixture: ComponentFixture<DeleteUploadsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUploadsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUploadsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
