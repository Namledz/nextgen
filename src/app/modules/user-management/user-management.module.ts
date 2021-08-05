import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { EditUserModalComponent } from './users/components/edit-user-modal/edit-user-modal.component';
import { DeleteUserModalComponent } from './users/components/delete-user-modal/delete-user-modal.component';
import { DeleteUsersModalComponent } from './users/components/delete-users-modal/delete-users-modal.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [UsersComponent, RolesComponent, UserManagementComponent, EditUserModalComponent, DeleteUserModalComponent, DeleteUsersModalComponent],
  imports: [
    CommonModule, 
    UserManagementRoutingModule,
    HttpClientModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbDatepickerModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  entryComponents: [
    UsersComponent
  ]
})
export class UserManagementModule {}
