import { environment } from '../../../../environments/environment';
import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';

@Injectable({
  providedIn: 'root'
})
export class VariantSelectedListService extends TableService<any> implements OnDestroy{
	API_URL = `${environment.apiUrl}/getSeletedVariants`;
	
	constructor(@Inject(HttpClient) http) {
		super(http);
	}

  	find(tableState: ITableState): Observable<TableResponseModel<any>> {
		return this.http.post<TableResponseModel<any>>(this.API_URL, tableState, { withCredentials: true })
	}

 	 deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

	createReport(data: any): Observable<any> {
		const url = `${this.API_URL}/createReport`;
		return this.http.post(url, data, { withCredentials: true, observe: 'response' })
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
