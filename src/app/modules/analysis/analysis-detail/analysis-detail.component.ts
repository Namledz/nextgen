import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';
import * as IGV from 'igv';
import { MatTab } from '@angular/material/tabs';
import { VariantListService } from '../_services/variant-list.service';
import { AnalysisService } from '../_services/analysis.service';
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
	type: string;
	@ViewChild('report', { static: true }) igvDiv: MatTab;

	indexBamUrl: any;
	bamUrl: any;

	igv: any;

	constructor(
		public variantListService: VariantListService,
		public analysisService: AnalysisService,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef
		) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		this.igv = IGV;
		this.isLoaded = false;
		this.getAnalysisName();
	
	}

	tabClick(tab) {
		if (tab.index == 2) {
			// this.getIgvInfo();
			
		}
		// console.log(this.igvDiv);
	}

	getAnalysisName() {
		this.variantListService.getAnalysisName(this.id)
			.subscribe((res: any) => {
				this.isLoaded = true;
				this.cd.detectChanges();
				if (res.status == 'success') {
					this.analysisName = res.data.name;
					this.type = res.data.type;
				} else {

				}
				
			})
	}

	


}
