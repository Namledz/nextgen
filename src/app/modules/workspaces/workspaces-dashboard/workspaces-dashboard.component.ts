import { Component, Input, OnInit } from '@angular/core';
import { WorkspacesService } from '../services/workspaces.service';

@Component({
  selector: 'app-workspaces-dashboard',
  templateUrl: './workspaces-dashboard.component.html',
  styleUrls: ['./workspaces-dashboard.component.scss']
})
export class WorkspacesDashboardComponent implements OnInit {
  info: any
  @Input() id: any;

  constructor(
    private workspaceService: WorkspacesService
  ) { }

  ngOnInit(): void {
    this.getWorkspaceDashboard()
  }

  getWorkspaceDashboard() {
    this.workspaceService.getWorkspaceDashboard(this.id).subscribe((response: any)=> {
      console.log(response)
    })
  }

}
