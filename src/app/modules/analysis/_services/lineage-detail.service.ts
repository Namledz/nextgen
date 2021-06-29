import { environment } from '../../../../environments/environment';
import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';

@Injectable({
  providedIn: 'root'
})
export class LineageDetailService  extends TableService<any> implements OnDestroy{
  API_URL = `${environment.apiUrl}/getLineageDetail`;

	constructor(@Inject(HttpClient) http) {
		super(http);

	}

  find(tableState: ITableState): Observable<TableResponseModel<any>> {
		return this.http.post<TableResponseModel<any>>(this.API_URL, tableState, { withCredentials: true })
	}

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
