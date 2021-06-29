import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesHomeComponent } from './analyses-home.component';

describe('AnalysesHomeComponent', () => {
  let component: AnalysesHomeComponent;
  let fixture: ComponentFixture<AnalysesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
