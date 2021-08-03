import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
	providedIn: 'root',
})
export class AuthHTTPService {
	constructor(private http: HttpClient) { }

	// public methods
	login(email: string, password: string): Observable<any> {
		return this.http.post<AuthModel>(`${API_USERS_URL}/login`, { email, password });
	}

	// CREATE =>  POST: add a new user to the server
	createUser(user: UserModel): Observable<UserModel> {
		return this.http.post<UserModel>(API_USERS_URL, user);
	}

	// Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
	forgotPassword(email: string): Observable<boolean> {
		return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
			email,
		});
	}

	getUserByToken(): Observable<any> {
		console.log("hellllllll")
		return this.http.get(`${API_USERS_URL}/getCurrentUser`, { withCredentials: true, observe: 'response' });
	}

	logout(): Observable<any> {
		return this.http.post(`${API_USERS_URL}/logout`, {}, { withCredentials: true, observe: 'response' });
	}

	setPassword(data): Observable<any> {
		return this.http.post(`${API_USERS_URL}/setPasswordUser`, data, { withCredentials: true, observe:'response'});
	}
}
