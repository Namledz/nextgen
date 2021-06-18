import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Analysis } from '../../../_models/analysis.model';
import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-fetch-analysis-modal',
	templateUrl: './fetch-analysis-modal.component.html',
	styleUrls: ['./fetch-analysis-modal.component.scss']
})
export class FetchAnalysisModalComponent implements OnInit, OnDestroy {
	@Input() ids: number[];
	analysis: Analysis[] = [];
	isLoading = false;
	subscriptions: Subscription[] = [];

	constructor(private analysisService: AnalysisService, public modal: NgbActiveModal) { }

	ngOnInit(): void {
		this.loadAnalysis();
	}

	loadAnalysis() {
		const sb = this.analysisService.items$.pipe(
			first()
		).subscribe((res: Analysis[]) => {
			this.analysis = res.filter(a => this.ids.indexOf(a.id) > -1);
		});
		this.subscriptions.push(sb);
	}

	fetchSelected() {
		this.isLoading = true;
		// just imitation, call server for fetching data
		setTimeout(() => {
			this.isLoading = false;
			this.modal.close();
		}, 1000);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
