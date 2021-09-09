import { Filter } from './../../auth/_models/filter.model';
import { UserModel } from './../../auth/_models/user.model';
import { environment } from '../../../../environments/environment';
import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel } from '../../../_metronic/shared/crud-table';

interface CustomInput {
    name: string,
    filter_string: string
}

@Injectable({
  providedIn: 'root'
})
export class FilterService extends TableService<any> implements OnDestroy{
	API_URL = `${environment.apiUrl}/filter`;
	
	constructor(@Inject(HttpClient) http) {
		super(http);
	}

    getFilters(user: UserModel) {
        let url = `${this.API_URL}/getFilters`
        return this.http.post(url , { user }, { withCredentials: true })
    }

    saveFilter(data: CustomInput) {
        let url = `${this.API_URL}/save`
        return this.http.post(url , { data }, { withCredentials: true })
    }

    loadFilter(name: string) {
        let url = `${this.API_URL}/load`
        return this.http.post(url , { name }, { withCredentials: true })
    }

    deleteFilter(name: string) {
        let url = `${this.API_URL}/delete`
        return this.http.post(url , { name }, { withCredentials: true })
    }

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
