import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysesComponent } from './analyses.component';


import { AnalysesListComponent } from './analyses/analyses.component';

const routes: Routes = [
	{
		path: '',
		component: AnalysesComponent,
		children: [
			{
				path: 'index',
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
