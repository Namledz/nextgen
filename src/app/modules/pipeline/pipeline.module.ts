import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

import { PipelineListComponent } from './pipeline-list/pipeline-list.component';
import { PipelineRoutingModule } from './pipeline-routing.module';
import { PipelineComponent } from './pipeline.component';


@NgModule({
	declarations: [
		PipelineListComponent,
		PipelineComponent
	],
	imports: [
		CommonModule,
		PipelineRoutingModule
	]
})
export class PipelineModule { }
