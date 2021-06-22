import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipelineComponent } from './pipeline.component';

import { PipelineListComponent } from './pipeline-list/pipeline-list.component';


const routes: Routes = [
	{
		path: '',
		component: PipelineComponent,
		children: [
			{
				path: 'list',
				component: PipelineListComponent,
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			// {path: '404', component: Error4Component},
			{ path: '**', redirectTo: 'errors/404', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PipelineRoutingModule { }
