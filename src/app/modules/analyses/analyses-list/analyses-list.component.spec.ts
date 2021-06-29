import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysesListComponent } from './analyses-list.component';

describe('AnalysesListComponent', () => {
  let component: AnalysesListComponent;
  let fixture: ComponentFixture<AnalysesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
