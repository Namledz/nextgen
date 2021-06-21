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

	chromosome = [
		'Chrom 1',
		'Chrom 2',
		'Chrom 3'
	]

	zygosity = [
		'Homozygous',
		'Heterozygous'
	]
	public options = {
		width: '100%',
		multiple: true,
		tags: true
	};


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
		this.filterForm();
		this.searchForm();
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
				if (res.status == 'success') {
					this.analysisName = res.data.name;
					this.type = res.data.type;
				} else {
				}
				this.isLoaded = true;
				this.cd.detectChanges();

			})
	}

	// filtration
	filterForm() {
		this.filterGroup = this.fb.group({
			chromosome: [''],
			gnomAdCompare: [''],
			gnomAdText: [''],
			qualityGreater: [''],
			qualityLower: [''],
			sequencenceOntology: [''],
			depthGreater: [''],
			depthLower: ['']
		});
	}

	applyFilter() {
		let filter = this.filter();
		console.log(this.filter());
		this.variantListService.patchState({ filter });
	}

	filter() {
		let filter = {};
		const chromosome = this.filterGroup.get('chromosome').value;
		if (chromosome) {
			filter['chrom'] = chromosome;
		}

		const depthGreater = this.filterGroup.get('depthGreater').value;
		if (depthGreater) {
			filter['depth_greater'] = depthGreater;
		}

		const depthLower = this.filterGroup.get('depthLower').value;
		if (depthLower) {
			filter['depth_lower'] = depthLower;
		}

		const qualityGreater = this.filterGroup.get('qualityGreater').value;
		if (qualityGreater) {
			filter['quality_greater'] = qualityGreater;
		}

		const qualityLower = this.filterGroup.get('qualityLower').value;
		if (qualityLower) {
			filter['quality_lower'] = qualityLower;
		}

		const gnomAdCompare = this.filterGroup.get('gnomAdCompare').value;
		const filterGnomAdText = this.filterGroup.get('gnomAdText').value;
		if (gnomAdCompare && filterGnomAdText) {
			filter['gnomad'] = {
				type: gnomAdCompare,
				value: filterGnomAdText
			}
		}

		const sequencenceOntology = this.filterGroup.get('sequencenceOntology').value;
		if (sequencenceOntology) {
			filter['sequencence_ontology'] = sequencenceOntology;
		}

		const geneName = this.searchGroup.get('geneName').value
		if (geneName) {
			filter['gene'] = geneName;
		}

		return filter;
	}

	searchForm() {
		this.searchGroup = this.fb.group({
			geneName: [''],
		});
	}

	search(searchTerm: string) {
		this.variantListService.patchState({ searchTerm });
	}

	formatLabel(value: number) {
		return value;
	}


}
