import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import * as IGV from '../../../../../../../../../packages/igv/igv';
import { AnalysisService } from '../../../../../_services/analysis.service'
@Component({
	selector: 'app-igv-modal',
	templateUrl: './igv-modal.component.html',
	styleUrls: ['./igv-modal.component.scss']
})
export class IgvModalComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() chrom: any;
	@Input() position: any;
	@Input() id: any;
	@ViewChild('igv', { static: true }) igvDiv: ElementRef;
	private subscriptions: Subscription[] = [];

	igv: any;
	indexBamUrl: any;
	bamUrl: any;
	locus: any;

	constructor(public modal: NgbActiveModal, private cd: ChangeDetectorRef, private analysisService: AnalysisService) { }

	ngOnInit(): void {
		console.log(this.chrom)
		console.log(this.position)
		this.igv = IGV;
		this.locus = `${this.chrom}:${this.position}`
		console.log(this.locus)
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
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

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	openIGVBrowser() {
		let self = this;
		let options =
		{
			genome: "hg19",
			locus: self.locus,
			showKaryo: false,
			showIdeogram: true,
			showNavigation: true,
			showRuler: true,
			showCenterGuide: true,

			// flanking: 1000,
			// minimumBases: 40,
			// pairsSupported: true,
			// promisified: false,
			// // reference: {
			// // 	fastaURL: "https://btgenomics-s3-prod.s3-us-west-2.amazonaws.com/public/fasta/hs37d5.fa",
			// // },
			
			// showCenterGuide: true,
			// showCenterGuideButton: true,
			// showChromosomeWidget: true,
			// showControls: true,
			// showCursorTrackingGuide: false,
			// showCursorTrackingGuideButton: true,
			// showIdeogram: true,
			// showKaryo: false,
			// showNavigation: true,
			// showRuler: false,
			// showSVGButton: true,
			// showSequence: true,
			// showTrackLabelButton: true,
			// showTrackLabels: true,
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
		this.igv.createBrowser(self.igvDiv.nativeElement, options)
			.then(function (browser) {
				console.log("Created IGV browser");
			})
			.catch(error => {
				console.log("Cannot create IGV browser");
				console.log("Create igv Error ", error);
			})
	}


}
