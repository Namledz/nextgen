import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';
import { Analysis } from '../_models/analysis.model';
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AnalysisService extends TableService<Analysis> implements OnDestroy {
	API_URL = `${environment.apiUrl}/analysis`;
	constructor(@Inject(HttpClient) http) {
		super(http);
	}


	// READ
	find(tableState: ITableState): Observable<TableResponseModel<Analysis>> {
		return this.http.get<Analysis[]>(this.API_URL).pipe(
			map((response: Analysis[]) => {
				const filteredResult = baseFilter(response, tableState);
				const result: TableResponseModel<Analysis> = {
					items: filteredResult.items,
					total: filteredResult.total
				};
				return result;
			})
		);
	}

	deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

	updateStatusForItems(ids: number[], status: number): Observable<any> {
		return this.http.get<Analysis[]>(this.API_URL).pipe(
			map((analysis: Analysis[]) => {
				return analysis.filter(a => ids.indexOf(a.id) > -1).map(a => {
					a.status = status;
					return a;
				});
			}),
			exhaustMap((analysis: Analysis[]) => {
				const tasks$ = [];
				analysis.forEach(a => {
					tasks$.push(this.update(a));
				});
				return forkJoin(tasks$);
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
