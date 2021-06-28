import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-analysis-info',
	templateUrl: './analysis-info.component.html',
	styleUrls: ['./analysis-info.component.scss']
})
export class AnalysisInfoComponent implements OnInit {

	info: any;
	@Input() id: any;

	constructor(private analysisService: AnalysisService,
		private cdr: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.getAnalysisInfo();
	}


	getAnalysisInfo() {
		this.analysisService.getAnalysisInfo(this.id).subscribe((response: any) => {
			if (response.status == 'success') {
				this.info = response.data;
				this.cdr.detectChanges();
			}
		})
	}


}
