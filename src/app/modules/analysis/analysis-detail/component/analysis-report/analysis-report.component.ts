import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';

import * as IGV from '../../../../../../../packages/igv/igv';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
		private cd: ChangeDetectorRef, private analysisService: AnalysisService) { }

	ngOnInit(): void {
		this.igv = IGV;

		if (this.type == 'fastq') {
			this.getFastqQC();
		} else {
			console.log(this.type)
			console.log(this.id);
			this.getVCFQC();
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
