import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
	constructor(private http: HttpClient) { }

  public generateRandomString(len) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < len; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

  	public fileUpload(data: any[] = []): Observable<any> {
		const tasks$ = [];
		data.forEach(el => {
		tasks$.push(this.http.put(el.signedUrl, el.file).pipe(
			catchError(err => {
				console.log("Error:", err)
				return of(undefined);
			})
		));
		})
		return forkJoin(tasks$);
	}

	postFilesInfor(filesInfor: any[] = []): Observable<any> {
		const tasks$ = [];
		filesInfor.forEach(el => {
			let data = {
				original_name: el.name,
				sample_name: el.sampleName,
				file_size: (el.size / (1024 * 1024)).toFixed(2),
				file_type: el.type,
				upload_name: el.uploadName,
				workspace: parseInt(el.project_id)
			}
			tasks$.push(this.postFileInfor(data));
		});
		return forkJoin(tasks$);
	}

  	postFileInfor(data: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/uploadFileInfor`, data, { withCredentials: true }).pipe(
			catchError((err) => {
				console.log("Error:", err)
				return of(undefined);
			})
		)
	}

  getBatchFilesSignedAuth(files: any[] = []): Observable<any> {
    const tasks$ = [];
    files.forEach(el => {
			tasks$.push(this.getBatchFileSignedAuth({uploadName: el.uploadName, fileType: el.type, index: el.index}));
		});
		return forkJoin(tasks$);
  }

  getBatchFileSignedAuth(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/signed_url`, data, { withCredentials: true }).pipe(
      catchError(err => {
        console.error(err);
        return of({});
      })
    )
  }
}
