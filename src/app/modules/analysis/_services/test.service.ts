import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TestService {
	protected http: HttpClient;

	API_URL = `${environment.apiUrl}`;
	constructor(http: HttpClient) {
		this.http = http;
	}

	getQCVCF(id: any): any {
		const url = `${this.API_URL}/getQCVCF/${id}`;
		return this.http.get(url, {})
	}
}
