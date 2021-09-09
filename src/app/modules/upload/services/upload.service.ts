import { Inject, Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, of, throwError  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpEventType } from '@angular/common/http';
import { map, catchError, switchMap, finalize, retryWhen, delay, take, concat } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends TableService<any> implements OnDestroy {
	API_URL = `${environment.apiUrl}/upload`;
	constructor(@Inject(HttpClient) http) {
		super(http);
	}

	find(tableState: ITableState): Observable<TableResponseModel<any>> {
		return this.http.post<TableResponseModel<any>>(this.API_URL, tableState, { withCredentials: true })
	}

	public generateRandomString(len) {
		let result = '';
		let characters = '0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < len; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	public fileUpload(data): Observable<any> {
		return this.http.put<HttpResponse<any>>(data.preSignedUrl, data.file, { headers: {'Access-Control-Expose-Headers': 'etag'}, observe: "response" }).pipe(
			retryWhen(errors => errors.pipe(
				switchMap((error) => {
					if(error.status == 0) {
						return of(error.status)
					}
					return of(error);
				}),
				take(100),
				delay(3000),
				concat(throwError({error: 'Sorry, there was an error (after 100 retries)'}))
			)),
			map((response: HttpResponse<any>) => {
				let obj = {
					ETag: response.headers.get('etag'),
					PartNumber: data.partNumber
				}
				return obj;
			}),
			catchError(err => {
				console.error(err);
				return of({status: "error"});
			})
		)
	}

	createMultipartUpload(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/createMultipartUpload`, data, { withCredentials: true }).pipe(
			catchError(err => {
				console.error(err);
				return of({status: "error"});
			})
		)
	}

	completeMultipartUpload(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/completeMultipartUpload`, data, { withCredentials: true }).pipe(
			catchError(err => {
				console.error(err);
				return of({status: "error"});
			})
		)
	}

  	postFileInfor(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/uploadFileInfor`, data, { withCredentials: true }).pipe(
			catchError((err) => {
				console.log("Error:", err)
				return of({status: "error"});
			})
		)
	}

    createUploadFastQ(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/createUploadFastQ`, data, { withCredentials: true }).pipe(
			catchError((err) => {
				console.log("Error:", err)
				return of({status: "error"});
			})
		)
	}

    createSampleFastQ(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/createSampleFastQ`, data, { withCredentials: true }).pipe(
			catchError((err) => {
				console.log("Error:", err)
				return of({status: "error"});
			})
		)
	}

	getBatchFilesSignedAuth(data: any[] = []): Observable<any> {
		const tasks$ = [];
		data.forEach(el => {
			tasks$.push(this.getBatchFileSignedAuth(el));
		});
		return forkJoin(tasks$);
	}

	getBatchFileSignedAuth(data: any): Observable<any> {
		let dataSend = {
			uploadName: data.uploadName, 
			partNumber: data.partNumber, 
			uploadId: data.uploadId,
		}
		return this.http.post(`${environment.apiUrl}/signed_url`, dataSend, { withCredentials: true }).pipe(
			map((response: any) => {
				let objRes = {
					preSignedUrl: response.preSignedUrl,
					file: data.file,
					partNumber: data.partNumber
				}
				return objRes;
			}),
			catchError(err => {
				console.error(err);
				return of({status: "error"});
			})
		)
	}

	deleteFile(id) {
		const url = `${this.API_URL}/deleteUploadFile/${id}`
		return this.http.delete<any>(url, {withCredentials: true})
	}

	deleteItemsFiles(ids: number[] = []): Observable<any>  {
		const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.deleteFile(id));
		});
		return forkJoin(tasks$);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
