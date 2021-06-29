import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { WorkspacesService } from '../services/workspaces.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-workspaces-dashboard',
	templateUrl: './workspaces-dashboard.component.html',
	styleUrls: ['./workspaces-dashboard.component.scss']
})
export class WorkspacesDashboardComponent implements OnInit {
	info: any
	@Input() id: any;
	data: any;
	show: boolean
	
	constructor(
		private workspaceService: WorkspacesService,
		private cd: ChangeDetectorRef,
		private toastr: ToastrService
		) { }		
	ngOnInit(): void {
		this.getWorkspaceDashboard()
	}


	getWorkspaceDashboard() {
		this.workspaceService.getWorkspaceDashboard(this.id).subscribe((response: any) => {
			if (response.status == "success") {
				this.data = response.data
			}
			this.cd.detectChanges();
		})
	}

	save() {
		let uploadData = this.data.replaceAll("\n", "<br>")
		console.log(uploadData)
		let info = {
			dashboardInfo: this.data,
			id: this.id
		}
		this.workspaceService.updateWorkspaceDashboard(info).subscribe((response: any)=> {
			if (response.status == "success") {
				this.toastr.success(response.message)
				this.show = false
			}
			this.cd.detectChanges();
		})
	}
}
