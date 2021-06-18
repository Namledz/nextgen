import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { VariantListService } from '../_services/variant-list.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
	selector: 'app-analysis-detail',
	templateUrl: './analysis-detail.component.html',
	styleUrls: ['./analysis-detail.component.scss']
})
export class AnalysisDetailComponent implements OnInit {
	id: any;
	analysisName: string;
	isLoaded: boolean;
	constructor(
		public variantListService: VariantListService,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef
		) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		console.log(this.id);
		this.isLoaded = false;
		this.getAnalysisName();
	}


	getAnalysisName() {
		this.variantListService.getAnalysisName(this.id)
			.subscribe((res: any) => {
				this.isLoaded = true;
				this.cd.detectChanges();
				if (res.status == 'success') {
					this.analysisName = res.data.name
				} else {

				}
			})
	}



}
