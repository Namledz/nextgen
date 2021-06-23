import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';
import { Variant } from '../_models/variant.model';
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class VariantListService extends TableService<Variant> implements OnDestroy {
	API_URL = `${environment.apiUrl}/variant`;
	
	constructor(@Inject(HttpClient) http) {
		super(http);
		this.sorting.column = 'classification';
		this.sorting.direction = 'asc';
	}

	getAnalysisName(id: any) {
		const url = `${environment.apiUrl}/analysis/${id}`;
		return this.http.get(url);
	}

	// READ
	find(tableState: ITableState): Observable<TableResponseModel<Variant>> {
		return this.http.post<TableResponseModel<Variant>>(this.API_URL, tableState, { withCredentials: true })
	}

	deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

	updateStatusForItems(ids: number[], status: number): Observable<any> {
		return this.http.get<Variant[]>(this.API_URL).pipe(
			map((analysis: Variant[]) => {
				return analysis
			}),
			exhaustMap((analysis: Variant[]) => {
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
