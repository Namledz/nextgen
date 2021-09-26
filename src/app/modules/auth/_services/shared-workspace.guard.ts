import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '..';

@Injectable({
  providedIn: 'root'
})
export class SharedWorkspaceGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let workspaceID = route.paramMap.get('id');
		const currentUser = this.authService.currentUserValue;
		return this.authService.getAccessUserIDsOfWorkspace(workspaceID).pipe(
			map(data => {
				if (data.indexOf((currentUser.id).toString()) == -1) {
					this.router.navigate(['/'])
				}
				return !!data
			}));
	}

}
