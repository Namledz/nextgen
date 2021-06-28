import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesComponent } from './workspaces.component';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';

const routes: Routes = [
	{
		path: '',
		component: WorkspacesComponent,
		children: [
			{
				path: 'list',
				component: WorkspacesListComponent
			},
			{
				path: 'samples',
				loadChildren: () =>
					import('../analysis/analysis.module').then(
						(m) => m.AnalysisModule
					),
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: '**', redirectTo: 'errors/404', pathMatch: 'full' },
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WorkspacesRoutingModule { }
