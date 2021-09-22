import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspacesComponent } from './workspaces.component';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';
import { WorkspacesIndexComponent } from './workspaces-index/workspaces-index.component';
import { WorkspacesDashboardComponent } from './workspaces-dashboard/workspaces-dashboard.component';
import { AnalysisModule } from '../analysis/analysis.module';
import { EditWorkspaceModalComponent } from './workspaces-list/components/edit-workspace-modal/edit-workspace-modal.component';
import { DeleteWorkspaceModalComponent } from './workspaces-list/components/delete-workspace-modal/delete-workspace-modal.component';
import { ShareWorkspaceModalComponent } from './workspaces-list/components/share-workspace-modal/share-workspace-modal.component';
import { SharedAnalysisListComponent } from './shared-analysis-list/shared-analysis-list.component';


@NgModule({
  declarations: [
    WorkspacesComponent,
    WorkspacesListComponent,
    WorkspacesIndexComponent,
    WorkspacesDashboardComponent,
    EditWorkspaceModalComponent,
    DeleteWorkspaceModalComponent,
    ShareWorkspaceModalComponent,
    SharedAnalysisListComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule,
    HttpClientModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbDatepickerModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    AnalysisModule
  ],
  entryComponents: [
    WorkspacesListComponent
  ]
})
export class WorkspacesModule { }
