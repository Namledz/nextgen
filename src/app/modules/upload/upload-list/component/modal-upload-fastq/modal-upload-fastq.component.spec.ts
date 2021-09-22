import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadFastqComponent } from './modal-upload-fastq.component';

describe('ModalUploadFastqComponent', () => {
  let component: ModalUploadFastqComponent;
  let fixture: ComponentFixture<ModalUploadFastqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUploadFastqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUploadFastqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
