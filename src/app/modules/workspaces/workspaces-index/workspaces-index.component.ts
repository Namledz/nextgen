import { Attribute, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisListComponent } from '../.././analysis/analysis-list/analysis-list.component'
import { WorkspacesService } from '../services/workspaces.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-workspaces-index',
	templateUrl: './workspaces-index.component.html',
	styleUrls: ['./workspaces-index.component.scss']
})
export class WorkspacesIndexComponent implements OnInit {

	constructor(
		@Attribute('type') public type: string,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef,
		private workspaceService: WorkspacesService,
		private _location: Location
	) { }
	id: any
	tab: any
	data: any
	dashboard: any
	info: any

	ngOnInit(): void {
		this.id = this.route.snapshot.params.id,
		this.tab = 1
		this.getWorkSpaceName();
	}


	getWorkSpaceName() {
		this.workspaceService.getWorkspaceName(this.id).subscribe((response: any) => {
			if (response.status == 'success') {
				this.info = response.data;
				console.log(this.info);
				this.cd.detectChanges();
			}
		})
	}

	changeInfo($event) {
		if ($event.target.type == "dashboard") {
			this.tab = 2
		} else {
			this.tab = 1
		}
		this.cd.detectChanges();
	}

	backClicked() {
		this._location.back();
	}


}
