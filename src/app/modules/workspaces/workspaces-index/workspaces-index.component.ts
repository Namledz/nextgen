import { Attribute, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisService } from '../../analysis/_services/analysis.service';
import { WorkspacesService } from '../services/workspaces.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateAnalysesModalComponent } from '../../analysis/analysis-list/components/create-analyses-modal/create-analyses-modal.component'

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
		private _location: Location,
        private modalService: NgbModal,
        private AnalysisService: AnalysisService
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

    createAnalysis() {
        const modalRef = this.modalService.open(CreateAnalysesModalComponent, { size: 'lg' });
        modalRef.componentInstance.projectId = this.route.snapshot.params.id;
        modalRef.result.then(() => 
            this.AnalysisService.fetch(),
            () => {}
        );
    }

	backClicked() {
		this._location.back();
	}


}
