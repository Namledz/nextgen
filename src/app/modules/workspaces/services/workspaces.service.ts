import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService extends TableService<any> implements OnDestroy {

	API_URL = `${environment.apiUrl}/workspaces`;
	constructor(@Inject(HttpClient) http) {
		super(http);
	}

  find(tableState: ITableState): Observable<TableResponseModel<any>> {
		return this.http.post<TableResponseModel<any>>(`${this.API_URL}/list`, tableState, { withCredentials: true })
	}
	
	deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
