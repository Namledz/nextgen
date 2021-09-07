import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { AnalysisService } from '../../../_services/analysis.service';

@Component({
	selector: 'app-delete-analysis-modal',
	templateUrl: './delete-analysis-modal.component.html',
	styleUrls: ['./delete-analysis-modal.component.scss']
})
export class DeleteAnalysisModalComponent implements OnInit, OnDestroy {
	@Input() id: number;
	isLoading = false;
	subscriptions: Subscription[] = [];

	constructor(private analysisService: AnalysisService, public modal: NgbActiveModal, private toastr: ToastrService) { }

	ngOnInit(): void {
	}

	deleteAnalysis() {
		this.isLoading = true;
		const sb = this.analysisService.delete(this.id).pipe(
			delay(1000), // Remove it from your code (just for showing loading)
			tap((res) => {
				if (res.status == "success") {
					this.toastr.success(res.message)
					this.modal.close()
				} else {
					this.toastr.error(res.message)
				}
			}),
			catchError((err) => {
				this.modal.dismiss(err);
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
