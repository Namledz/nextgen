import { Component, OnInit, Input } from '@angular/core';

import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-analysis-info',
	templateUrl: './analysis-info.component.html',
	styleUrls: ['./analysis-info.component.scss']
})
export class AnalysisInfoComponent implements OnInit {

	info: any;
	@Input() id: any;

	constructor(private analysisService: AnalysisService) { }

	ngOnInit(): void {
		this.getAnalysisInfo();
	}


	getAnalysisInfo() {
		this.analysisService.getAnalysisInfo(this.id).subscribe((response: any) => {
			if (response.status == 'success') {
				this.info = response.data;
			}
		})
	}


}
