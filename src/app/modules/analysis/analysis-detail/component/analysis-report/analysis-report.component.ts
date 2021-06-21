import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';

import * as IGV from '../../../../../../../packages/igv/igv';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TestService } from '../../../_services/test.service'
import { AnalysisService } from '../../../_services/analysis.service'
@Component({
	selector: 'app-analysis-report',
	templateUrl: './analysis-report.component.html',
	styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {
	@Input() id: any;
	@Input() type: string;
	igv: any;
	@ViewChild('igv', { static: true }) igvDiv: ElementRef;
	htmlString: string;
	html: SafeHtml
	htmlData: any;
	indexBamUrl: any;
	bamUrl: any;

	constructor(private sanitizer: DomSanitizer, 
		private cd: ChangeDetectorRef, private testService: TestService, private analysisService: AnalysisService) { }

	ngOnInit(): void {
		this.igv = IGV;

		if (this.type == 'fastq') {
			this.getFastqQC();
		} else {
			console.log(this.type)
			console.log(this.id);
			this.getVCFQC();
		}
		this.getIgvInfo();
	}

	getVCFQC() {
		var self = this;
		const sb = this.testService.getQCVCF(this.id)
			.subscribe(function (res) {
				if (res.status == "success") {
					self.htmlString = res.html;
					self.htmlData = self.sanitizer.bypassSecurityTrustHtml(self.htmlString);
					self.cd.detectChanges();
				}
			})
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
		// let options = {
		// 	genome: "hg38",
		// 	locus: "chr8:127,736,588-127,739,371",
		// 	tracks: [
		// 		{
		// 			"name": "HG00103",
		// 			"url": "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram",
		// 			"indexURL": "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram.crai",
		// 			"format": "cram"
		// 		}
		// 	]
		// };
		console.log(this.igvDiv.nativeElement);
		this.igv.createBrowser(this.igvDiv.nativeElement, options)
			.then(function (browser) {
				console.log("Created IGV browser");
			})
			.catch(error => {
				console.log("Cannot create IGV browser");
				console.log("Create igv Error ", error);
			})
	}

	getFastqQC() {
		this.analysisService.getFastqQC().subscribe(response => {
			this.html = this.sanitizer.bypassSecurityTrustHtml(response);
		})
	}
}
