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
          { path:'', redirectTo: 'list', pathMatch: 'full'}
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspacesRoutingModule { }
