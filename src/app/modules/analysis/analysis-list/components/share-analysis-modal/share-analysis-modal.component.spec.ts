import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAnalysisModalComponent } from './share-analysis-modal.component';

describe('ShareAnalysisModalComponent', () => {
  let component: ShareAnalysisModalComponent;
  let fixture: ComponentFixture<ShareAnalysisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareAnalysisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
