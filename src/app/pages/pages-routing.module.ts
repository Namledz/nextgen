import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			// {
			// 	path: 'dashboard',
			// 	loadChildren: () =>
			// 		import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
			// },
			{
				path: 'analyses',
				loadChildren: () =>
					import('../modules/analyses/analyses.module').then(
						(m) => m.AnalysesModule
					),
			},
			{
				path: 'samples',
				loadChildren: () =>
					import('../modules/samples/samples.module').then(
						(m) => m.SamplesModule
					),
			},
			{
				path: 'upload',
				loadChildren: () =>
					import('../modules/upload/upload.module').then(
						(m) => m.UploadModule
					),
			},
			{
				path: 'workspaces',
				loadChildren: () =>
					import('../modules/workspaces/workspaces.module').then(
						(m) => m.WorkspacesModule
					),
			},
			{
				path: 'builder',
				loadChildren: () =>
					import('./builder/builder.module').then((m) => m.BuilderModule),
			},
			{
				path: 'pipeline',
				loadChildren: () =>
					import('../modules/pipeline/pipeline.module').then(
						(m) => m.PipelineModule
					),
			},
			{
				path: 'builder',
				loadChildren: () =>
					import('./builder/builder.module').then((m) => m.BuilderModule),
			},
			{
				path: 'user-management',
				loadChildren: () =>
					import('../modules/user-management/user-management.module').then(
						(m) => m.UserManagementModule
					),
			},
			{
				path: 'user-profile',
				loadChildren: () =>
					import('../modules/user-profile/user-profile.module').then(
						(m) => m.UserProfileModule
					),
			},
			{
				path: '',
				redirectTo: 'workspaces',
				pathMatch: 'full',
			},
			{
				path: '**',
				redirectTo: 'errors/404',
				pathMatch: 'full',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule { }
