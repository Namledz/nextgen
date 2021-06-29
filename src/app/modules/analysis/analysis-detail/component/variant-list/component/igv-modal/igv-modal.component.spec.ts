import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgvModalComponent } from './igv-modal.component';

describe('IgvModalComponent', () => {
  let component: IgvModalComponent;
  let fixture: ComponentFixture<IgvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgvModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
