import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUsersModalComponent } from './delete-users-modal.component';

describe('DeleteUsersModalComponent', () => {
  let component: DeleteUsersModalComponent;
  let fixture: ComponentFixture<DeleteUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
