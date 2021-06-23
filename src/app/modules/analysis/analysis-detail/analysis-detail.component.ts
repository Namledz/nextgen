import { style } from '@angular/animations';
import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';
import * as IGV from 'igv';
import { MatTab } from '@angular/material/tabs';
import { VariantListService } from '../_services/variant-list.service';
import { AnalysisService } from '../_services/analysis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
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
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	@ViewChild('report', { static: true }) igvDiv: MatTab;

	indexBamUrl: any;
	bamUrl: any;

	igv: any;
	tabIndex = 0;




	constructor(
		public variantListService: VariantListService,
		public analysisService: AnalysisService,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef,
		private fb: FormBuilder,
	) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		this.igv = IGV;
		this.isLoaded = false;
		this.getAnalysisName();

	}

	tabClick(event) {
		this.tabIndex = event.index;
	}

	getAnalysisName() {
		this.variantListService.getAnalysisName(this.id)
			.subscribe((res: any) => {
				if (res.status == 'success') {
					this.analysisName = res.data.name;
					this.type = res.data.type;
				} else {
				}
				this.isLoaded = true;
				this.cd.detectChanges();

			})
	}



}
