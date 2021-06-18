import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-delete-analyses-modal',
	templateUrl: './delete-analyses-modal.component.html',
	styleUrls: ['./delete-analyses-modal.component.scss']
})
export class DeleteAnalysesModalComponent implements OnInit, OnDestroy {
	@Input() ids: number[];
	isLoading = false;
	subscriptions: Subscription[] = [];

	constructor(private analysisService: AnalysisService, public modal: NgbActiveModal) { }

	ngOnInit(): void {
	}

	deleteAnalysis() {
		this.isLoading = true;
		const sb = this.analysisService.deleteItems(this.ids).pipe(
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
