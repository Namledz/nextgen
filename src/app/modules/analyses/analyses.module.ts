import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

import { AnalysesComponent } from './analyses.component';
import { AnalysisRoutingModule } from './analyses-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

import { AnalysesListComponent } from './analyses/analyses.component';

@NgModule({
	declarations: [
		AnalysesComponent,
		AnalysesListComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		AnalysisRoutingModule,
		InlineSVGModule,
		CRUDTableModule,
		NgbModalModule,
		NgbDatepickerModule,
		MatCardModule,
		MatIconModule,
		MatTabsModule,
		MatSelectModule,
		MatListModule,
		MatButtonModule,
		NgSelect2Module,
		MatSliderModule,
		NgbDropdownModule,
		MatProgressSpinnerModule
	],
	entryComponents: [
	]
})
export class AnalysesModule { }
