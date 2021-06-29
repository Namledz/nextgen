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

import { AnalysisComponent } from './analysis.component';
import { AnalysisRoutingModule } from './analysis-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { DeleteAnalysisModalComponent } from './analysis-list/components/delete-analysis-modal/delete-analysis-modal.component';
import { DeleteAnalysesModalComponent } from './analysis-list/components/delete-analyses-modal/delete-analyses-modal.component';
import { FetchAnalysisModalComponent } from './analysis-list/components/fetch-analysis-modal/fetch-analysis-modal.component';
import { UpdateAnalysisStatusModalComponent } from './analysis-list/components/update-analysis-status-modal/update-analysis-status-modal.component';
import { EditAnalysisModalComponent } from './analysis-list/components/edit-analysis-modal/edit-analysis-modal.component';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';
import { VariantListComponent } from './analysis-detail/component/variant-list/variant-list.component';
import { AnalysisInfoComponent } from './analysis-detail/component/analysis-info/analysis-info.component';
import { AnalysisReportComponent, SafePipe } from './analysis-detail/component/analysis-report/analysis-report.component';
import { AnalysesComponent } from './analyses/analyses.component';
import { GenomeBrowserComponent } from './analysis-detail/component/genome-browser/genome-browser.component';
import { VariantDetailModalComponent } from './analysis-detail/component/variant-detail-modal/variant-detail-modal.component';
import { AnalysisReportVariantComponent } from './analysis-detail/component/analysis-report-variant/analysis-report-variant.component';

@NgModule({
	declarations: [
		AnalysisComponent,
		DeleteAnalysisModalComponent,
		DeleteAnalysesModalComponent,
		FetchAnalysisModalComponent,
		UpdateAnalysisStatusModalComponent,
		EditAnalysisModalComponent,
		AnalysisListComponent,
		AnalysisDetailComponent,
		VariantListComponent,
		AnalysisInfoComponent,
		AnalysisReportComponent,
		AnalysesComponent,
		GenomeBrowserComponent,
		SafePipe,
		VariantDetailModalComponent,
		AnalysisReportVariantComponent
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
		DeleteAnalysisModalComponent,
		DeleteAnalysesModalComponent,
		FetchAnalysisModalComponent,
		UpdateAnalysisStatusModalComponent,
		EditAnalysisModalComponent,
		AnalysisListComponent
	],
	exports: [
		AnalysisListComponent
	]
})
export class AnalysisModule { }
