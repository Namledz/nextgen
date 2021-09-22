import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedAnalysisService extends TableService<any> implements OnDestroy {

  constructor(@Inject(HttpClient) http) {
		super(http);
	}

  find(tableState: ITableState): Observable<TableResponseModel<any>> {
		return this.http.post<TableResponseModel<any>>(`${environment.apiUrl}/workspaces/getListSharedAnalysis`, tableState, { withCredentials: true })
	}

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
