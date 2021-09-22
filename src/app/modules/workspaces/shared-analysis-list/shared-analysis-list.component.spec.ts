import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAnalysisListComponent } from './shared-analysis-list.component';

describe('SharedAnalysisListComponent', () => {
  let component: SharedAnalysisListComponent;
  let fixture: ComponentFixture<SharedAnalysisListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAnalysisListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAnalysisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
