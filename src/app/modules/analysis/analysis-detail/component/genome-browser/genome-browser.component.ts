import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as IGV from '../../../../../../../packages/igv/igv';
import { AnalysisService } from '../../../_services/analysis.service'

@Component({
	selector: 'app-genome-browser',
	templateUrl: './genome-browser.component.html',
	styleUrls: ['./genome-browser.component.scss']
})
export class GenomeBrowserComponent implements OnInit {

	@Input() id: any;
	@Input() type: string;
	igv: any;
	@ViewChild('igv', { static: true }) igvDiv: ElementRef;
	indexBamUrl: any;
	bamUrl: any;
	constructor(private cd: ChangeDetectorRef, private analysisService: AnalysisService) { }

	ngOnInit(): void {
		this.igv = IGV;
	}

	ngAfterViewInit(): void {
		setTimeout(() =>{
			this.getIgvInfo();
		}, 500)
	}

	getIgvInfo() {
		this.analysisService.getIgvInfo(this.id).subscribe((response: any) => {
			if (response.status == 'success') {
				let data = response.data
				this.bamUrl = data.bamUrl;
				this.indexBamUrl = data.indexBamUrl;
				this.openIGVBrowser();
			}
		})
	}

	openIGVBrowser() {
		let options =
		{
			flanking: 1000,
			minimumBases: 40,
			pairsSupported: true,
			promisified: false,
			// reference: {
			// 	fastaURL: "https://btgenomics-s3-prod.s3-us-west-2.amazonaws.com/public/fasta/hs37d5.fa",
			// },
			genome: "hg19",
			showCenterGuide: true,
			showCenterGuideButton: true,
			showChromosomeWidget: true,
			showControls: true,
			showCursorTrackingGuide: false,
			showCursorTrackingGuideButton: true,
			showIdeogram: true,
			showKaryo: false,
			showNavigation: true,
			showRuler: true,
			showSVGButton: true,
			showSequence: true,
			showTrackLabelButton: true,
			showTrackLabels: true,
			tracks: [
				{
					colorBy: "strand",
					displayMode: "EXPANDED",
					filename: "realigned.bam",
					format: "bam",
					indexURL: this.indexBamUrl,
					label: "Example",
					noSpinner: true,
					order: 1,
					sourceType: "file",
					type: "alignment",
					url: this.bamUrl,
					visibilityWindow: 300000000
				},
				{
					displayMode: "EXPANDED",
					filename: "gencode.v18.annotation.sorted.gtf.gz",
					format: "gtf",
					indexURL: "https://s3-us-west-2.amazonaws.com/btgenomics-s3-prod/public/hg19/gencode.v18.annotation.sorted.gtf.gz.tbi",
					name: "Genes",
					noSpinner: true,
					order: 2,
					sourceType: "file",
					type: "annotation",
					url: "https://s3-us-west-2.amazonaws.com/btgenomics-s3-prod/public/hg19/gencode.v18.annotation.sorted.gtf.gz"
				},
				{
					noSpinner: true,
					order: "-1.7976931348623157e+308",
					type: "sequence",
				}
			]
		};
		// console.log(this.igvDiv.nativeElement);
		this.igv.createBrowser(this.igvDiv.nativeElement, options)
			.then(function (browser) {
				console.log("Created IGV browser");
			})
			.catch(error => {
				console.log("Cannot create IGV browser");
				console.log("Create igv Error ", error);
			})
	}

}
