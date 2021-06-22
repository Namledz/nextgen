import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';
import { UploadComponent } from '../modules/upload/upload.component';;

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
				path: 'analysis',
				loadChildren: () =>
					import('../modules/analysis/analysis.module').then(
						(m) => m.AnalysisModule
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
				component: UploadComponent,
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
				redirectTo: 'analysis',
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
