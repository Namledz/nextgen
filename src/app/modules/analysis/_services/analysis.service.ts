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
		return this.http.post<TableResponseModel<Analysis>>(`${this.API_URL}`, tableState, { withCredentials: true })
	}
	deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

	updateStatusForItems(ids: number[], status: number): Observable<any> {
		return this.http.get<Analysis[]>(this.API_URL, { withCredentials: true }).pipe(
			map((analysis: Analysis[]) => {
				return analysis.filter(a => ids.indexOf(a.id) > -1).map(a => {
					// a.status = status;
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

	getFastqQC(): Observable<any> {
		let url = `${this.API_URL}/getFastqQC`
		return this.http.get(url, { withCredentials: true }).pipe((response) => {
			return response
		});
	}

	getIgvInfo(analysisId: any) {
		let url = `${this.API_URL}/get-igv-info/${analysisId}`
		return this.http.get(url, { withCredentials: true }).pipe((response) => {
			return response;
		})
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	getAnalysisInfo(id) {
		let url = `${environment.apiUrl}/analysis-info/${id}`
		return this.http.get(url, { withCredentials: true }).pipe((response) => {
			return response;
		});
	}

	getQCVCF(id: any): any {
		const url = `${environment.apiUrl}/getQCVCF/${id}`;
		return this.http.get(url, { withCredentials: true })
	}

	getProjectName(id: any): any{
		const url = `${environment.apiUrl}/workspace/project-name/${id}`;
		return this.http.get(url, { withCredentials: true })
	}

	getVennDiagramData(data: any): any {
		const url = `${environment.apiUrl}/analysis/venn-data`;
		return this.http.post(url, { data: data }, { withCredentials: true });
	}
}
