import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuspiceTreeComponent } from './auspice-tree.component';

describe('AuspiceTreeComponent', () => {
  let component: AuspiceTreeComponent;
  let fixture: ComponentFixture<AuspiceTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuspiceTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuspiceTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
