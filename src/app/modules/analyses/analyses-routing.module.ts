import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysesComponent } from './analyses.component';


import { AnalysesListDetailComponent } from './analyses/analyses.component';

import { AnalysesHomeComponent } from './analyses-home/analyses-home.component'

import { AnalysesListComponent } from './analyses-list/analyses-list.component'
import { AnalysesDetailComponent } from './analyses-detail/analyses-detail.component'

const routes: Routes = [
	{
		path: '',
		component: AnalysesComponent,
		children: [
			{
				path: 'index',
				component: AnalysesHomeComponent
			},
			{
				path: 'list',
				component: AnalysesListDetailComponent
			},
			{
				path: 'detail/:id',
				component: AnalysesDetailComponent
			},
			{
				path: 'detail-list/:id',
				component: AnalysesListComponent
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
