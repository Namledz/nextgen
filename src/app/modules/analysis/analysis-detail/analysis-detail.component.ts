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
	asideState: boolean = true
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

	chromosomeList = [
		'Chr 1',
		'Chr 2',
		'Chr 3',
		'Chr 4',
		'Chr 5',
		'Chr 6',
		'Chr 7',
		'Chr 8',
		'Chr 9',
		'Chr 10',
		'Chr 11',
		'Chr 12',
		'Chr 13',
		'Chr 14',
		'Chr 15',
		'Chr 16',
		'Chr 17',
		'Chr 18',
		'Chr 19',
		'Chr 20',
		'Chr 21',
		'Chr 22',
		'Chr X',
		'Chr Y',
		'Chr MT'
	]

	annotationList = [
		"5' UTR",
		"Inframe deletion",
		"Splice donor",
		"Frameshift",
		"Coding",
		"other",
		"Upstream",
		"Synonymous",
		"Noncoding transcript",
		"3' UTR",
		"NMD",
		"Stop gained",
		"Downstream",
		"Noncoding exon",
		"Inframe insertion",
		"Regulatory region",
		"Start retained",
		"Protein altering variant",
		"Intergenic",
		"Stop retained",
		"Start loss",
		"Noncoding Transcript",
		"Missense",
		"Splice acceptor",
		"Intron",
		"Splice region",
		"Stop lost",
		"Start lost"
	]

	classificationList = [
		"uncertain significance",
		"likely benign",
		"drug response",
		"pathogenic",
		"benign",
		"likely pathogenic",
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
		// this.searchForm();
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

	// filtration
	filterForm() {
		this.filterGroup = this.fb.group({
			geneName: [''],
			chromosome: [],
			gnomADfrom: [''],
			gnomADto: [''],
			depthGreater: 0,
			annotation: [''],
			classification: [''],
			alleleFraction: ['']
			// qualityGreater: [''],
			// qualityLower: [''],
			// sequencenceOntology: [''],
			// depthLower: [''],
			// readDepth: ['']
		});
	}

	applyFilter() {
		let filter = this.filter();
		console.log("Filter", this.filter());
		this.variantListService.patchState({ filter });
	}

	filter() {
		let filter = {};
		const chromosome = this.filterGroup.get('chromosome').value;
		if (chromosome) {
			let arrayInt = []
			chromosome.forEach(e => {
				let tmp = e.split(" ")
				arrayInt.push(parseInt(tmp[1]))
			})
			console.log(arrayInt)
			filter['chrom'] = arrayInt;
		}

		const depthGreater = this.filterGroup.get('depthGreater').value;
		if (depthGreater) {
			filter['depth_greater'] = depthGreater;
		}

		const gnomADfrom = this.filterGroup.get('gnomADfrom').value;
		if (gnomADfrom) {
			filter['gnomADfrom'] = gnomADfrom;
		}

		const gnomADto = this.filterGroup.get('gnomADto').value;
		if (gnomADto) {
			filter['gnomADto'] = gnomADto;
		}

		// const sequencenceOntology = this.filterGroup.get('sequencenceOntology').value;
		// if (sequencenceOntology) {
		// 	filter['sequencence_ontology'] = sequencenceOntology;
		// }

		const geneName = this.filterGroup.get('geneName').value
		if (geneName) {
			filter['gene'] = geneName;
		}

		const annotation = this.filterGroup.get('annotation').value
		if (annotation) {
			filter['annotation'] = annotation;
		}

		const classification = this.filterGroup.get('classification').value
		if (classification) {
			filter['classification'] = classification;
		}

		const alleleFraction = this.filterGroup.get('alleleFraction').value
		if (alleleFraction) {
			filter['alleleFraction'] = alleleFraction;
		}
		// const depthLower = this.filterGroup.get('depthLower').value;
		// if (depthLower) {
		// 	filter['depth_lower'] = depthLower;
		// }

		// const qualityGreater = this.filterGroup.get('qualityGreater').value;
		// if (qualityGreater) {
		// 	filter['quality_greater'] = qualityGreater;
		// }

		// const qualityLower = this.filterGroup.get('qualityLower').value;
		// if (qualityLower) {
		// 	filter['quality_lower'] = qualityLower;
		// }

		// const gnomAdCompare = this.filterGroup.get('gnomAdCompare').value;
		// const filterGnomAdText = this.filterGroup.get('gnomAdText').value;
		// if (gnomAdCompare && filterGnomAdText) {
		// 	filter['gnomad'] = {
		// 		type: gnomAdCompare,
		// 		value: filterGnomAdText
		// 	}
		// }



		return filter;
	}

	// searchForm() {
	// 	this.searchGroup = this.fb.group({
	// 		geneName: [''],
	// 	});
	// }

	search(searchTerm: string) {
		this.variantListService.patchState({ searchTerm });
	}

	formatLabel(value: number) {
		return value;
	}

	toggleAside() {
		if (this.asideState) {
			this.asideState = false
			document.getElementById("aside").style.width = '0'
			document.getElementById("aside").style.padding = '0'
			document.getElementById("aside").style.border = 'none'
			document.getElementById("content-container").style.width = '98%'
			document.getElementById("filter-conatiner").style.display = 'none'

		} else {
			this.asideState = true
			document.getElementById("aside").style.width = '15%'
			document.getElementById("aside").style.padding = '20px'
			document.getElementById("aside").style.border = '1px solid #dee2e6'
			document.getElementById("content-container").style.width = '85%'
			document.getElementById("filter-conatiner").style.display = 'block'
		}


	}

}
