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

	getWorkspaceName(id: any) {
		console.log(id);
		return this.http.get(`${environment.apiUrl}/workspace/project-name/${id}`, { withCredentials: true }).pipe((response) => {
			return response
		})
	}

	updateWorkspaceDashboard(data) {
		return this.http.post(`${this.API_URL}/update`, {data: data}, { withCredentials: true })
	}

	deleteItems(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.delete(id));
		});
		return forkJoin(tasks$);
	}

	getWorkspaceDashboard(id) {
		return this.http.get(`${this.API_URL}/dashboard/${id}`, { withCredentials: true }).pipe((response) => {
			return response
		})
	}

	getListPipeline(): Observable<any> {
		return this.http.get(`${this.API_URL}/getPipeline`,  { withCredentials: true }).pipe((response) => {
			return response
		})
	}

	createWorkspace(data): Observable<any> {
		return this.http.post(`${this.API_URL}/createWorkspace`, data, {withCredentials: true}).pipe((response) => {
			return response
		})
 	}
	
	search(searchTerm): Observable<any> {
		return this.http.post(`${this.API_URL}/search`, {data: searchTerm}, {withCredentials: true}).pipe((response) => {
			return response
		})
	}

	delete(id) {
		return this.http.delete<any>(`${this.API_URL}/deleteWorkspace/${id}`, {withCredentials: true}).pipe(response => {
		  return response
		})
	}

	getWorkspaceById(id) {
		return this.http.get<any>(`${this.API_URL}/getWorkspaceById/${id}`, {withCredentials: true}).pipe((response) =>{
			return response
		})
	}

	updateWorkspace(data) {
		return this.http.post<any>(`${this.API_URL}/updateWorkspace`, data, {withCredentials: true}).pipe((response) => {
			return response
		})
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
