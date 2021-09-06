import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkspacesService } from 'src/app/modules/workspaces/services/workspaces.service';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
})
export class SearchModalComponent implements OnInit {
	@Input() searchTerm;
	total: any;
	totalAll: any
	data: any
	subscriptions: Subscription[] = [];

	constructor(
		public modal: NgbActiveModal,
		private workspaceService: WorkspacesService
	) { }

	ngOnInit(): void {
		this.search()
	}

	search() {
		this.workspaceService.search(this.searchTerm).pipe()
			.subscribe(response => {
				console.log(response)
				this.total = response.total,
				this.totalAll = response.totalAll
				this.data = response.data
			})
		
	}

}
