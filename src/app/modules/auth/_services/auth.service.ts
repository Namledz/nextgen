import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http/auth-http.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ResponseModel } from '../_models/response.model';

@Injectable({
	providedIn: 'root',
})
export class AuthService implements OnDestroy {
	// private fields
	currentUser: UserModel

	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

	// public fields
	currentUser$: Observable<UserModel>;
	isLoading$: Observable<boolean>;
	currentUserSubject: BehaviorSubject<UserModel>;
	isLoadingSubject: BehaviorSubject<boolean>;


	get currentUserValue(): UserModel {
		return this.currentUserSubject.value;
	}

	set currentUserValue(user: UserModel) {
		this.currentUserSubject.next(user);
	}

	constructor(
		private authHttpService: AuthHTTPService,
		private router: Router
	) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
		this.currentUser$ = this.currentUserSubject.asObservable();
		this.isLoading$ = this.isLoadingSubject.asObservable();
		// const subscr = this.getUserByToken().subscribe();
		// this.unsubscribe.push(subscr);
	}

	// public methods
	login(email: string, password: string): Observable<UserModel> {
		this.isLoadingSubject.next(true);
		let self = this;
		let res;
		return this.authHttpService.login(email, password).pipe(
			map((response) => {
				res = self.convertResponse(response);
				return res;
			}),
			switchMap(() => this.getUserByToken()),
			switchMap(() => { return of(res)}),
			catchError((err) => {
				console.error('err', err);
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	logout() {
		console.log("Logging out")
		return this.authHttpService.logout().pipe(
			map(() => {
				// localStorage.clear()
				return true;
			}),
			catchError((err) => {
				return of(undefined);
			}))
	}

	getUserByToken(): Observable<UserModel> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.getUserByToken().pipe(
			map((response) => {
				let res = this.convertResponse(response);
				if (res.status == 'success' && res.data) {
					this.currentUserSubject = new BehaviorSubject<UserModel>(res.data);
					this.currentUser = res.data
					return res.data;
				} else {
					this.redirectLogin();
					throw new Error("Redirect");
				}
			}),
			catchError((err) => {
				console.log(err);
				this.redirectLogin();
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	redirectLogin() {
		// localStorage.removeItem(this.authLocalStorageToken);
		console.log("hello")
		this.router.navigate(['/auth/login'], { queryParams: {} })
	}

	private convertResponse(response): ResponseModel {
		let res = new ResponseModel;
		res.status = response.status;
		res.message = response.message || '';
		res.data = response.data || {};
		return res;
	}

	// need create new user then login
	registration(user: UserModel): Observable<any> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.createUser(user).pipe(
			map(() => {
				this.isLoadingSubject.next(false);
			}),
			switchMap(() => this.login(user.email, user.password)),
			catchError((err) => {
				console.error('err', err);
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	forgotPassword(email: string): Observable<boolean> {
		this.isLoadingSubject.next(true);
		return this.authHttpService
			.forgotPassword(email)
			.pipe(finalize(() => this.isLoadingSubject.next(false)));
	}

	// private methods
	private setAuthFromLocalStorage(auth: AuthModel): boolean {
		// store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
		if (auth && auth.accessToken) {
			localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
			return true;
		}
		return false;
	}

	private getAuthFromLocalStorage(): AuthModel {
		try {
			const authData = JSON.parse(
				localStorage.getItem(this.authLocalStorageToken)
			);
			return authData;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}
}
