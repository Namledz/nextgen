import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { Analysis } from '../../../_models/analysis.model';
import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-update-analysis-status-modal',
	templateUrl: './update-analysis-status-modal.component.html',
	styleUrls: ['./update-analysis-status-modal.component.scss']
})
export class UpdateAnalysisStatusModalComponent implements OnInit, OnDestroy {
	@Input() ids: number[];
	status = 2;
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
			this.analysis = res.filter(c => this.ids.indexOf(c.id) > -1);
		});
		this.subscriptions.push(sb);
	}

	updateAnalysisStatus() {
		this.isLoading = true;
		const sb = this.analysisService.updateStatusForItems(this.ids, +this.status).pipe(
			delay(1000), // Remove it from your code (just for showing loading)
			tap(() => this.modal.close()),
			catchError((errorMessage) => {
				this.modal.dismiss(errorMessage);
				return of(undefined);
			}),
			finalize(() => {
				this.isLoading = false;
			})
		).subscribe();
		this.subscriptions.push(sb);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
