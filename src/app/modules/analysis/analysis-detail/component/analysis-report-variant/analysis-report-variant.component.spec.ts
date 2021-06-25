import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisReportVariantComponent } from './analysis-report-variant.component';

describe('AnalysisReportVariantComponent', () => {
  let component: AnalysisReportVariantComponent;
  let fixture: ComponentFixture<AnalysisReportVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisReportVariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisReportVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
