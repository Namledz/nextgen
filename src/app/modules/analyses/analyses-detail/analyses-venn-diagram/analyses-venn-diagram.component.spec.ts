import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesVennDiagramComponent } from './analyses-venn-diagram.component';

describe('AnalysesVennDiagramComponent', () => {
  let component: AnalysesVennDiagramComponent;
  let fixture: ComponentFixture<AnalysesVennDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesVennDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesVennDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
