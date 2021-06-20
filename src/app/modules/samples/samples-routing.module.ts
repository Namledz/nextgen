import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SamplesComponent } from './samples.component';
import { SamplesListComponent } from './samples-list/samples-list.component';

const routes: Routes = [
    {
        path: '',
        component: SamplesComponent,
        children: [
            {
                path: 'list',
                component: SamplesListComponent
            },
            { path:'', redirectTo: 'list', pathMatch: 'full'}
        ]
    },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SamplesRoutingModule { }