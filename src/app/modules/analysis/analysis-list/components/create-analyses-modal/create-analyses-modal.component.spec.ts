import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnalysesModalComponent } from './create-analyses-modal.component';

describe('CreateAnalysesModalComponent', () => {
  let component: CreateAnalysesModalComponent;
  let fixture: ComponentFixture<CreateAnalysesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAnalysesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnalysesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
