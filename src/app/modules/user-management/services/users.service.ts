import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<any> implements OnDestroy {

  API_URL = `${environment.apiUrl}/users`;
  constructor(@Inject(HttpClient) http) {
    super(http);
   }

  ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

  getItemUserById(uuid) {
    const url = `${this.API_URL}/findUserById/${uuid}`;
    return this.http.get<any>(url, {withCredentials: true}).pipe((response) => {
      return response
    });
  }

  updateUser(item) {
    const url = `${this.API_URL}/updateUser`;
    return this.http.post<any>(url, item, {withCredentials: true}).pipe(response => {
      return response
    })
  }

  createUser(item) {
    const url = `${this.API_URL}/createUser`;
    return this.http.post<any>(url, item, {withCredentials: true}).pipe(response => {
      return response
    })
  }

  deleteUser(id) {
    const url = `${this.API_URL}/deleteUser/${id}`;
    return this.http.delete<any>(url, {withCredentials: true}).pipe(response => {
      return response
    })
  }

  deleteItemsUsers(ids: number[] = []): Observable<any> {
    const tasks$ = [];
		ids.forEach(id => {
			tasks$.push(this.deleteUser(id));
		});
		return forkJoin(tasks$);
  }
}
