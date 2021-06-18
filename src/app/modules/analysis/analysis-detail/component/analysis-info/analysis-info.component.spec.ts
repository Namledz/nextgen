import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisInfoComponent } from './analysis-info.component';

describe('AnalysisInfoComponent', () => {
  let component: AnalysisInfoComponent;
  let fixture: ComponentFixture<AnalysisInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
