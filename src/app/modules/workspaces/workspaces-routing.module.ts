import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesComponent } from './workspaces.component';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';
import { WorkspacesIndexComponent } from './workspaces-index/workspaces-index.component';
import { SharedAnalysisListComponent } from './shared-analysis-list/shared-analysis-list.component';
import { SharedWorkspaceGuard } from '../auth/_services/shared-workspace.guard';
import { AuthGuard } from '../auth/_services/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: WorkspacesComponent,
		children: [
			{
				path: 'list',
				component: WorkspacesListComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'index/:id',
				component: WorkspacesIndexComponent,
				canActivate: [AuthGuard,SharedWorkspaceGuard]
			},
			{
				path: 'shared-analysis',
				component: SharedAnalysisListComponent,
				canActivate: [AuthGuard]
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
