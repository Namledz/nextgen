import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysisComponent } from './analysis.component';

import { AnalysisListComponent } from './analysis-list/analysis-list.component';

import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';

const routes: Routes = [
	{
		path: '',
		component: AnalysisComponent,
		children: [
			{
				path: 'list',
				component: AnalysisListComponent,
			},
			{
				path: ':id',
				component: AnalysisDetailComponent,
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			// {path: '404', component: Error4Component},
			{ path: '**', redirectTo: 'list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AnalysisRoutingModule { }
