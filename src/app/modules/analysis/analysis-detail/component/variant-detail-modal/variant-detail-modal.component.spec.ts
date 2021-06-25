import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantDetailModalComponent } from './variant-detail-modal.component';

describe('VariantDetailModalComponent', () => {
  let component: VariantDetailModalComponent;
  let fixture: ComponentFixture<VariantDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantDetailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
