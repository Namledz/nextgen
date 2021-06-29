import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild, Pipe, PipeTransform } from '@angular/core';

import * as IGV from '../../../../../../../packages/igv/igv';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalysisService } from '../../../_services/analysis.service'


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) { }
	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}


@Component({
	selector: 'app-analysis-report',
	templateUrl: './analysis-report.component.html',
	styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit  {
	@Input() id: any;
	@Input() type: string;
	igv: any;
	@ViewChild('igv', { static: true }) igvDiv: ElementRef;
	@ViewChild('iframe', { static: true }) iframe: ElementRef;
	htmlString: string;
	html: SafeHtml
	htmlData: any;
	indexBamUrl: any;
	bamUrl: any;
	url: any;
	isLoading: any;
	iframeShow: any;

	constructor(private sanitizer: DomSanitizer, 
		private cd: ChangeDetectorRef, private analysisService: AnalysisService) { }


	ngOnInit(): void {
		this.igv = IGV;
		const self = this;
		if (this.type == 'fastq') {
			this.getFastqQC();
		} else {
			this.isLoading = true;
			this.url = `http://varigenes.com/vcf/index.html?vcf=https://varigenes-s3.s3.us-west-2.amazonaws.com/samples/sample${this.id}/output-hc-v1.vcf.gz&species=Human&build=GRCh37`
			self.iframe.nativeElement.onload = function () {
				const els = self.iframe.nativeElement.contentWindow.document.getElementById('banner');
				const els2 = self.iframe.nativeElement.contentWindow.document.getElementById('selectData');
				els.style.display = 'none';
				els2.style.display = 'none';
			};
			setTimeout(() => {
				this.isLoading = false;
				self.cd.detectChanges();
			}, 1000)
		}
	}


	getVCFQC() {
		var self = this;
		const sb = this.analysisService.getQCVCF(this.id)
			.subscribe(function (res) {
				if (res.status == "success") {
					self.htmlString = res.html;
					self.htmlData = self.sanitizer.bypassSecurityTrustHtml(self.htmlString);
					self.cd.detectChanges();
				}
			})
	}
	getFastqQC() {
		this.analysisService.getFastqQC().subscribe(response => {
			this.html = this.sanitizer.bypassSecurityTrustHtml(response);
		})
	}
}
