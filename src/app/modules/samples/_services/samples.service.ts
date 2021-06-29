import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Samples } from '../_models/samples.model';

@Injectable({
  providedIn: 'root'
})
export class SamplesService extends TableService<Samples> implements OnDestroy {
  API_URL = `${environment.apiUrl}/samples`;
  constructor(@Inject(HttpClient) http) {
      super(http)
  }
  
  // READ
	find(tableState: ITableState): Observable<TableResponseModel<Samples>> {
		return this.http.post<TableResponseModel<Samples>>(`${this.API_URL}/list`, tableState, { withCredentials: true })
	}

  uploadSample(files: Array<any>) {
    const url = `${environment.apiUrl}/uploadSample`;
    return this.http.post<Array<any>>(url, { files }, { withCredentials: true })
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
