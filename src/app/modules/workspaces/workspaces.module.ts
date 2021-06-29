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


@NgModule({
  declarations: [
    WorkspacesComponent,
    WorkspacesListComponent,
    WorkspacesIndexComponent,
    WorkspacesDashboardComponent
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
