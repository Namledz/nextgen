import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserModel } from '../../../auth';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  user$: Observable<UserModel>;
  constructor(public userService: AuthService) {
    this.user$ = this.userService.currentUserSubject.asObservable();

  }

  getUserRole(role) {
	switch (role) {
		case 0:
			return 'Admin'
		case 1:
			return 'User'
		default:
			return 'Unknow'
	}
  }

  formatPhonenumber(phoneNumber) {
      return phoneNumber?.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
}
