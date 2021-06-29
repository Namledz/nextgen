import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesInfoComponent } from './analyses-info.component';

describe('AnalysesInfoComponent', () => {
  let component: AnalysesInfoComponent;
  let fixture: ComponentFixture<AnalysesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
