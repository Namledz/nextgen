import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesDetailComponent } from './analyses-detail.component';

describe('AnalysesDetailComponent', () => {
  let component: AnalysesDetailComponent;
  let fixture: ComponentFixture<AnalysesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
