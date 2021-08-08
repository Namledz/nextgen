import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component'
import { UploadListComponent } from './upload-list/upload-list.component';
import { ModalUploadComponent } from './upload-list/component/modal-upload/modal-upload.component';
import { ProgressComponent } from './upload-list/component/progress/progress.component';
import { DndDirective } from './upload-list/directives/dnd.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteUploadModalComponent } from './upload-list/component/delete-upload-modal/delete-upload-modal.component';
import { DeleteUploadsModalComponent } from './upload-list/component/delete-uploads-modal/delete-uploads-modal.component';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  declarations: [
    UploadComponent,
    UploadListComponent,
    ModalUploadComponent,
    ProgressComponent,
    DndDirective,
    DeleteUploadModalComponent,
    DeleteUploadsModalComponent
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
    HttpClientModule,
    CRUDTableModule,
    InlineSVGModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
  ],
  entryComponents: [
    UploadListComponent
  ]
})
export class UploadModule { }
