import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { UploadListComponent } from './upload-list/upload-list.component'

const routes: Routes = [
	{
		path: '',
		component: UploadComponent,
		children: [
			{
				path: 'list',
				component: UploadListComponent
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
export class UploadRoutingModule { }
