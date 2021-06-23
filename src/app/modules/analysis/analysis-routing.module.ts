import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysisComponent } from './analysis.component';

import { AnalysisListComponent } from './analysis-list/analysis-list.component';

import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';

import { AnalysesComponent } from './analyses/analyses.component';

const routes: Routes = [
	{
		path: '',
		component: AnalysisComponent,
		children: [
			{
				path: 'index',
				component: AnalysesComponent
			},
			{
				path: 'list/:id',
				component: AnalysisListComponent,
			},
			{
				path: 'detail/:id',
				component: AnalysisDetailComponent,
			},
			{ path: '', redirectTo: 'index', pathMatch: 'full' },
			// {path: '404', component: Error4Component},
			{ path: '**', redirectTo: 'errors/404', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AnalysisRoutingModule { }
