import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TestService {
  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getQCVCF(id: any): any {
		const url = `http://localhost:6969/getQCVCF/${id}`;
		return this.http.get(url, {})
	}
}
