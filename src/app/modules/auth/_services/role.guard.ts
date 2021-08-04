import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const requiredRoles = route.data.requiredRoles;
    const currentUser = this.authService.currentUserValue;
    console.log(currentUser)
    if (currentUser.role == requiredRoles) {
	  // admin so return true
      return true;
    }
    // not logged in as admin so redirect to login page with the return url
    this.router.navigate(['/']);
    return false;
  }
}
